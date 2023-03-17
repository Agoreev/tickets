import {useRouter} from "next/router";
import {useState} from "react";
import {useRequest} from "../../hooks/use-request";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const onSuccess = async () => {
        router.push('/');
    }
    const { doRequest, errors } = useRequest('/api/users/sign-up', 'post', { email, password }, onSuccess);

    const onSubmit = async  (event) => {
        event.preventDefault();
        doRequest();
    }

    return <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
            <label>Email address</label>
            <input value={ email } onChange={e => setEmail(e.target.value)} className="form-control" />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" />
        </div>
        { errors }
        <button className="btn btn-primary">Sign Up</button>
    </form>
}
