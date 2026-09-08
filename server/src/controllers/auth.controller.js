import * as authService from '../services/auth.service.js';

export const register = async (req, res, next) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json(userData);
  } catch (error) {
    if (error.message === 'User already exists') {
      res.status(400);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const userData = await authService.loginUser(req.body);
    res.json(userData);
  } catch (error) {
    res.status(401);
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  res.json(req.user);
};
