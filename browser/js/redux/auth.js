import axios from 'axios';
import { browserHistory } from 'react-router';

/* ------------------    ACTIONS    --------------------- */

const SET = 'SET_CURRENT_USER';

/* --------------    ACTION CREATORS    ----------------- */

const set = user => ({ type: SET, user });

/* ------------------    REDUCER    --------------------- */

export default function reducer (currentUser = null, action) {
  switch (action.type) {

    case SET:
      return action.user;

    default:
      return currentUser;
  }
}

/* ------------       DISPATCHERS     ------------------ */

/**
 * Dispatchers are just async action creators.
 * Action creators are supposed to emit actions.
 * Actions will be reduced to produce a new state.
 *
 * However, thunks can also do side effects, such as route to another location.
 * This could get faisrly elaborate, by taking arguments as to where to go, or
 * whether to change routes at all. But we illustrate a simple case with some
 * composed dispatchers which also route to a specific page.
 *
 * If we wanted the calling code (component) to handle the result instead, we
 * would use the "simple" dispatcher and chain off the returned promise.
 * Components should probably know nothing about side effects, however.
 */

const resToData = res => res.data;

// a "simple" dispatcher which uses API, changes state, and returns a promise.
export const login = credentials => dispatch => {
  return axios.put('/api/auth/me', credentials)
  .then(resToData)
  .then(user => {
    dispatch(set(user));
    return user;
  });
};

// a "composed" dispatcher which uses the "simple" one, then routes to a page.
export const loginAndGoToUser = credentials => dispatch => {
  dispatch(login(credentials))
  .then(user => browserHistory.push(`/users/${user.id}`))
  .catch(err => console.error('Problem logging in:', err));
};