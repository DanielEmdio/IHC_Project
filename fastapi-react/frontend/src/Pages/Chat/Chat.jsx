import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as utils from "../../Utils/utils";
import { API_URL, api } from "../../api";
import { TiArrowBack } from "react-icons/ti";
//import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Chat() {
    const [recipient, setRecipient] = useState("Chat");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [ws, setWs] = useState(null);
    const { id } = useParams();
    //const history = useHistory();

    // get recipient name
    useEffect(() => {
        api.post(`/users/${utils.isNormalUser() ? 'getPtById' : 'getUserById'}/${id}`, { token: utils.getCookie("token") }).then((r) => {
            const d = r.data;
            if (d.result === "ok") {
                setRecipient(utils.isNormalUser() ? d.pt.name : d.user.name);
            }
        }).catch((_) => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // get chat messages
        api.post(`/chat/getChatMessages?id=${id}`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;

            if (data.messages) {
                data.messages.forEach(element => {
                    let sender = "";
                    if ((element.sent_by_user && utils.isNormalUser()) || (!element.sent_by_user && !utils.isNormalUser())) {
                        sender = " You";
                    } else if (element.sent_by_user && !utils.isNormalUser()) {
                        sender = "Athlete ";
                    } else if (!element.sent_by_user && utils.isNormalUser()) {
                        sender = "Pt ";
                    }

                    const newMessage = {
                        sender: sender,
                        message: element.text
                    };

                    setMessages(prevMessages => [...prevMessages, newMessage]);
                });
            }

            startChat();
        }).catch((_) => {
            startChat();
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const startChat = () => {
        const socket = new WebSocket(`${API_URL.replace(/^.*:\/\//, 'ws://')}/chat`);
        socket.onopen = (_) => {
            socket.send(JSON.stringify({ "token": utils.getCookie("token"), "id": id }));
            setWs(socket);
        };

        socket.onmessage = (m) => {
            const data = JSON.parse(m.data);
            const sender = utils.isNormalUser() ? "Pt " : "Athlete ";
            const newMessage = {
                sender: sender,
                message: data.message
            };

            setMessages(prevMessages => [...prevMessages, newMessage]);
        };

        socket.onerror = (e) => {
            console.error(e);
        }
    };

    const handleSubmit = async (form) => {

        // clear the input box
        setMessage('');

        // prevent form submission
        form.preventDefault();

        // trim the message and check if the message is empty
        const trimmedMessage = message.trim();
        if (trimmedMessage === '') { return; }

        const newMessage = {
            sender: " You",
            message: message
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        if (ws) {
            ws.send(JSON.stringify({ "message": message }));
        }
        else {
            console.error("Websocket not initialized");
        }
    };

    return (
        <div className='py-4'>
            <div className='w-11/12 mx-auto shadow rounded p-3'>
                <div className='flex'>
                    <strong className='text-3xl basis-full'>{recipient}</strong>
                    <button><Link to={"/chat"}><TiArrowBack className='size-10'/></Link></button>
                </div>
                <hr className='mt-3 mb-4' />
                <div className='px-1' style={{ height: '600px', maxHeight: '600px', overflowY: 'scroll' }}>
                    {messages.map((message, index) => (
                        <div key={index} className={`pt-1 flex ${message.sender.includes('You') ? 'justify-end' : 'justify-start'}`}>
                            <span className={`p-2 rounded ${message.sender.includes('You') ? 'bg-green-300' : 'bg-gray-300'}`} key={index}>{message.message}</span>
                        </div>
                    ))}
                </div>
                <hr className='mt-4 mb-3' />
                <form className='flex justify-center' onSubmit={handleSubmit}>
                    <input className='border-1 border-black rounded text-center mr-1' type="text" placeholder="Write your message" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button type="submit" className="btn btn-primary">Send</button>
                </form>
            </div>
        </div>
    );
}
