import React from 'react';
import Signup from './Signup';
import Signin from './Signin';
import axios from 'axios';
import store from '../../store/index';
import Toast from '../Toast/Toast';
import './Auth.css';

export default class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'signin',
            showToast: false
        }
    }

    signIn = (email, password) => {
        axios.post('/api/users/login', {email, password}).then(res => {
            if (res.data.success) {
                store.dispatch({
                    type: 'login',
                    _id: res.data.user._id,
                    user: res.data.user,
                    token: res.data.token
                });
                this.props.history.push('/dashboard');
            } else {
                this.setState({
                    showToast: true
                });
                setTimeout(() => {
                    this.setState({showToast: false})
                }, 3000);
            }
        }).catch(er => {
            this.setState({
                showToast: true
            });
            setTimeout(() => {
                this.setState({showToast: false})
            }, 3000);
        })
    }

    signUp = ({firstName, lastName, email, password}) => {
        axios.post('/api/users/register', {firstName, lastName, email, password}).then(res => {
            if (res.data.success) {
                this.setState({tab: 'signin'});
            }
        }).catch(er => {
            console.log(er);
        })
    }

    changeTab = () => {
        this.setState({
            tab: this.state.tab === 'signup' ? 'signin' : 'signup'
        });
    }

    render() {
        let page = this.state.tab === 'signin' ? <Signin signIn={this.signIn} /> : <Signup signUp={this.signUp} />
        return (
            <div className="auth-wrapper">
                <Toast model={this.state.showToast} message="Incorrect login" backgroundColor="#FF4539" />
                <div className="left">
                    <img src="https://cdn.pixabay.com/photo/2022/02/02/10/56/questions-6988157_1280.png" />
                </div>

                <div className="right">
                    <div className="header">MindMingle</div>
                    <div className="sub-header">Have Fun With MindMingle</div>
                    {page}
                    <div className="new" onClick={this.changeTab}>{this.state.tab === 'signin' ? 'New to MindMingle? Sign up here' : 'Already have an account with us? Sign in'}</div>
                </div>
            </div>
        )
    }
}