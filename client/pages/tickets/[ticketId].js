import {useRouter} from "next/router";
import {useRequest} from "../../hooks/use-request";

const TicketShow = ({ ticket }) => {
    const router = useRouter();
    const { doRequest, errors } = useRequest(
        '/api/orders',
        'post',
        { ticketId: ticket.id },
        (order) => router.push(`/orders/${order.id}`)
    );

    return <div>
        <h1>{ticket.title}</h1>
        <h4>{ticket.price}</h4>
        {errors}
        <button onClick={() => doRequest()} className="btn btn-primary">Purchase</button>
    </div>
};

TicketShow.getInitialProps = async (context, client) => {
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);

    return { ticket: data };
}

export default TicketShow;
