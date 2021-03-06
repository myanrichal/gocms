import {fork, takeEvery, put, call} from 'redux-saga/effects';
import * as loginActions from './loginPage.actions';
import * as apiActions from '../../../base/actions/apiRequestActions';
import {Post, ENDPOINTS} from '../../../base/services/api';
import {addUserToSession, syncSessionUserToState} from '../../services/authentication'
import { browserHistory } from 'react-router'



// watch for login requests
function* watchLoginSaga() {
    yield takeEvery(loginActions.GOCMS_LOGIN, handleLoginSaga); // see details what is REQUEST param below
}

function* handleLoginSaga(action) {
    let {res, err} = yield call(Post, ENDPOINTS.login, action.data); // calling our api method
    if (res) {
        // push user info to store and storage
        yield call(addUserToSession, res.json);
        yield call(syncSessionUserToState);
        yield put(apiActions.purge(action.key));
        browserHistory.push(GOCMS_LOGIN_SUCCESS_REDIRECT);
    }
    else if (err) {
        // fetch page data based on uri
        yield put(apiActions.failure(action.key, err));
    }
}

export default function* loginPageSagas() {
    yield [
        fork(watchLoginSaga),
    ];
}