import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import StripeCheckout from "react-stripe-checkout";
import {useRequest} from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
    const [timeLeft, setTimeLeft] = useState('');

    const router = useRouter();

    const {doRequest, errors} = useRequest(
        '/api/payments',
        'post',
        {
            orderId: order.id,
        },
        () => router.push('/orders')
    )

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000).toString());
        }
        findTimeLeft()
        const interval = setInterval(findTimeLeft, 1000);

        return () => clearInterval(interval);
    }, []);

    if (timeLeft < 0) {
        return <div>Order is expired</div>
    }

    return <div>
        {timeLeft} seconds until order expires
        <StripeCheckout
            token={({ id }) => doRequest({ token: id })}
            stripeKey="pk_test_51MkBkhIsIElS5uPPkDCIcA3doHcVtQeBQMvVOZf1tAnmLdSaYiE4hNp7ZFW0Tr33wG3fe0PoeTmdkixzAwmsFIJH00BmOcGDc5"
            amount={order.ticket?.price * 100}
            email={currentUser.email}
        />
        {errors}
    </div>
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order: data };
}

export default OrderShow;
