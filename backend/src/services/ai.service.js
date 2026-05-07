'use strict';
const prisma = require('../database/prisma');
const { parsePagination, paginationMeta } = require('../utils/pagination');

/**
 * AI Lab service.
 * In production, replace generateAIResponse() with an OpenAI / Anthropic call.
 */

const listConversations = async (userId, query) => {
  const { page, limit, skip } = parsePagination(query);
  const [conversations, total] = await Promise.all([
    prisma.aIConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      skip, take: limit,
      select: {
        id: true, title: true, createdAt: true, updatedAt: true,
        _count: { select: { messages: true } },
      },
    }),
    prisma.aIConversation.count({ where: { userId } }),
  ]);
  return { conversations, meta: paginationMeta(total, page, limit) };
};

const getConversation = async (userId, conversationId) => {
  const conv = await prisma.aIConversation.findFirst({
    where: { id: conversationId, userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!conv) { const e = new Error('Conversation not found'); e.statusCode = 404; throw e; }
  return conv;
};

const createConversation = async (userId, title = 'New Conversation') => {
  return prisma.aIConversation.create({
    data: { userId, title },
    select: { id: true, title: true, createdAt: true },
  });
};

const deleteConversation = async (userId, conversationId) => {
  const conv = await prisma.aIConversation.findFirst({ where: { id: conversationId, userId }, select: { id: true } });
  if (!conv) { const e = new Error('Conversation not found'); e.statusCode = 404; throw e; }
  await prisma.aIConversation.delete({ where: { id: conversationId } });
};

/**
 * Send a message and get an AI response.
 * Persists both user message and AI reply.
 */
const sendMessage = async (userId, conversationId, userMessage) => {
  // Verify ownership
  const conv = await prisma.aIConversation.findFirst({
    where: { id: conversationId, userId },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
  });
  if (!conv) { const e = new Error('Conversation not found'); e.statusCode = 404; throw e; }

  // Persist user message
  await prisma.aIMessage.create({
    data: { conversationId, sender: 'user', content: userMessage },
  });

  // Build context from user's subjects + recent activity
  const [subjects, streak] = await Promise.all([
    prisma.subject.findMany({
      where: { userId, isArchived: false },
      select: { name: true, priority: true, progress: true, deadline: true },
      orderBy: { priority: 'desc' },
      take: 5,
    }),
    prisma.studyStreak.findUnique({ where: { userId } }),
  ]);

  // Generate AI response (stub — replace with real LLM call)
  const aiText = generateAIResponse(userMessage, subjects, streak, conv.messages);

  const aiMessage = await prisma.aIMessage.create({
    data: { conversationId, sender: 'ai', content: aiText, tokensUsed: aiText.length },
  });

  // Update conversation title from first user message
  if (conv.messages.length === 0) {
    await prisma.aIConversation.update({
      where: { id: conversationId },
      data: { title: userMessage.slice(0, 60) },
    });
  }

  return aiMessage;
};

/**
 * Stub AI response generator.
 * Replace with: const response = await openai.chat.completions.create({ ... })
 */
const generateAIResponse = (userMessage, subjects, streak, history) => {
  const subjectNames = subjects.map(s => s.name).join(', ');
  const highPriority = subjects.find(s => s.priority === 'high');

  if (userMessage.toLowerCase().includes('study plan')) {
    return `Based on your current subjects (${subjectNames}), here's a recommended 3-day study plan:\n\n` +
      subjects.slice(0, 3).map((s, i) =>
        `Day ${i + 1}: Focus on **${s.name}** — target ${Math.max(1, Math.round((100 - s.progress) / 20))} hours.`
      ).join('\n');
  }

  if (userMessage.toLowerCase().includes('weak')) {
    return `Based on your progress data, your weakest areas are in subjects with less than 50% completion. ` +
      `I recommend scheduling extra sessions for ${subjects.filter(s => s.progress < 50).map(s => s.name).join(', ') || 'your pending subjects'}.`;
  }

  if (highPriority) {
    return `Your highest priority subject is **${highPriority.name}** with ${highPriority.progress}% progress. ` +
      `I recommend a focused 2-hour deep-work session today. Your current streak is ${streak?.currentStreak ?? 0} days — keep it going!`;
  }

  return `I've analyzed your study profile. You're currently working on ${subjectNames}. ` +
    `Your ${streak?.currentStreak ?? 0}-day streak shows great consistency. ` +
    `Would you like me to create a personalized study plan or quiz you on a specific topic?`;
};

module.exports = { listConversations, getConversation, createConversation, deleteConversation, sendMessage };
