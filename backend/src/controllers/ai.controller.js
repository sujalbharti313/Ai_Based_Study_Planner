'use strict';
const aiService = require('../services/ai.service');
const { success, created, noContent } = require('../utils/response');

const listConversations  = async (req, res, next) => { try { success(res, await aiService.listConversations(req.user.id, req.query)); } catch (e) { next(e); } };
const getConversation    = async (req, res, next) => { try { success(res, await aiService.getConversation(req.user.id, req.params.id)); } catch (e) { next(e); } };
const createConversation = async (req, res, next) => { try { created(res, await aiService.createConversation(req.user.id, req.body.title)); } catch (e) { next(e); } };
const deleteConversation = async (req, res, next) => { try { await aiService.deleteConversation(req.user.id, req.params.id); noContent(res); } catch (e) { next(e); } };

const sendMessage = async (req, res, next) => {
  try {
    const msg = await aiService.sendMessage(req.user.id, req.params.id, req.body.message);
    success(res, msg);
  } catch (e) { next(e); }
};

module.exports = { listConversations, getConversation, createConversation, deleteConversation, sendMessage };
