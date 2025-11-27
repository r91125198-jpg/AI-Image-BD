
import React, { createContext, useReducer, ReactNode } from 'react';
import type { GlobalState, Action, User } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD, INITIAL_CREDIT_PACKAGES, INITIAL_PAYMENT_DETAILS } from '../config';

const initialState: GlobalState = {
  currentUser: null,
  isAuthenticated: false,
  users: [],
  payments: [],
  settings: {
    paymentDetails: INITIAL_PAYMENT_DETAILS,
    creditPackages: INITIAL_CREDIT_PACKAGES,
  },
  imageHistory: [],
};

const stateReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, currentUser: action.payload };
    case 'LOGOUT':
      return { ...initialState, users: state.users, payments: state.payments, settings: state.settings, imageHistory: state.imageHistory };
    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        currentUser: action.payload,
        users: [...state.users, action.payload],
      };
    case 'UPDATE_USER':
        return {
            ...state,
            users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
            currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
        }
    case 'DEDUCT_CREDITS': {
        const { userId, amount } = action.payload;
        const updatedUsers = state.users.map(user => 
            user.id === userId ? { ...user, credits: user.credits - amount } : user
        );
        const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, credits: state.currentUser.credits - amount } : state.currentUser;
        return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    case 'ADD_CREDITS': {
        const { userId, amount } = action.payload;
        const updatedUsers = state.users.map(user => 
            user.id === userId ? { ...user, credits: user.credits + amount } : user
        );
        const updatedCurrentUser = state.currentUser?.id === userId ? { ...state.currentUser, credits: state.currentUser.credits + amount } : state.currentUser;
        return { ...state, users: updatedUsers, currentUser: updatedCurrentUser };
    }
    case 'CREATE_PAYMENT_REQUEST':
      return { ...state, payments: [action.payload, ...state.payments] };
    case 'UPDATE_PAYMENT_REQUEST':
        return {
            ...state,
            payments: state.payments.map(p => p.id === action.payload.id ? action.payload : p)
        };
    case 'UPDATE_PAYMENT_DETAILS':
        return { ...state, settings: { ...state.settings, paymentDetails: action.payload }};
    case 'SET_CREDIT_PACKAGES':
        return { ...state, settings: { ...state.settings, creditPackages: action.payload }};
    case 'ADD_IMAGE_TO_HISTORY':
        return {
            ...state,
            imageHistory: [action.payload, ...state.imageHistory]
        };
    case 'DELETE_IMAGE_FROM_HISTORY':
        return {
            ...state,
            imageHistory: state.imageHistory.filter(img => img.id !== action.payload.imageId)
        };
    default:
      return state;
  }
};

export const GlobalStateContext = createContext<{
  state: GlobalState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
