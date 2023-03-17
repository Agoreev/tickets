import {useRouter} from "next/router";
import {useEffect} from "react";
import {useRequest} from "../../hooks/use-request";


export default () => {

    const router = useRouter();

    const onSuccess = () => {
        router.push('/');
    }

    const { doRequest, errors } = useRequest('/api/users/sign-out', 'post', {}, onSuccess);

    useEffect(() => {
        doRequest();
    }, [doRequest]);

    return <div>Signing you out!</div>;
}
