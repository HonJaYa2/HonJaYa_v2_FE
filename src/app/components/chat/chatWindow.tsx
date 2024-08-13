import React, { useEffect, useRef, useState } from 'react';
import ChatMessage from './chatMessage';
import ChatInput from './chatInput';
import SockJS from 'sockjs-client';
import { CompatClient, Stomp } from '@stomp/stompjs';
import Navigationbar from '../common/Navigationbar';
import socket, { io } from 'socket.io-client'


interface ChatWindowProps {
    roomNum: Number;
    isGroupChat: boolean;
}

interface Message {
    // id: string;
    msg: string;
    sender: string;
    senderId: string;
    senderProfile: string;
    // receiver: string;
    // roomNum: number;
    isOwnMessage: boolean;
    createAt: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ roomNum, isGroupChat }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const stompClient = useRef<CompatClient>();
    // const subscriptionRef = useRef<any>();
    const socket = useRef<any>();

    useEffect(() => {
        const handleNewMessage = (message: Message) => {
            const formattedMessage: Message = {
                // id: message.id,
                msg: message.msg,
                sender: message.sender,
                senderId: message.senderId,
                senderProfile: message.senderProfile,
                // receiver: message.receiver,
                // roomNum: message.roomNum,
                isOwnMessage: message.senderId === localStorage.getItem("userId"),
                createAt: message.createAt,
            };
            console.log(formattedMessage);
            setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        };

        if (isGroupChat) {
            // 그룹 채팅에 대한 로직이 필요하면 추가
        } else {
            const getMessageHistory = async () => {
                try {
                    // const messages = await getData(`http://localhost:8080/chat/${roomNum}`, "honjaya");
                    const response = await fetch('http://localhost:8080/chat/${roomNum}', {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json"
                        }
                    })
                    const messages = await response.json();
                    messages.forEach((message: any) => {
                        handleNewMessage(message);
                    })
                    console.log(JSON.stringify(messages));
                } catch (error) {
                    console.error(error);
                }
            }
            // getMessageHistory();
            // WebSocket 연결 설정
            socket.current = io('http://localhost:8080', {
                path: '/ws/socket.io',  // 서버와 동일한 경로로 설정
                transports: ['websocket'],
            });

            // 연결 성공 시 방에 조인
            socket.current.on('connect', () => {
                console.log('Connected to server');
                socket.current.emit('joinRoom', roomNum);
            });

            // 메시지 수신 시 처리
            socket.current.on('receiveMessage', (data: string) => {
                const message = JSON.parse(data);
                handleNewMessage(message);
                console.log(`Room ${roomNum}: New message received: `, message);
            });

            // 컴포넌트 언마운트 시 WebSocket 연결 종료
            return () => {
                socket.current?.disconnect();
            };            // const socket = new SockJS('http://localhost:8081/ws/chat');
            // stompClient.current = Stomp.over(socket);

            // const connectCallback = (frame : any) => {
            //     console.log('Connected: ' + frame);

            //     if (subscriptionRef.current) {
            //         subscriptionRef.current.unsubscribe();
            //     }

            //     subscriptionRef.current = stompClient.current?.subscribe(`/topic/chat/receive/${roomNum}`, (data) => {
            //         try {
            //             const message = JSON.parse(data.body);
            //             handleNewMessage(message);
            //             console.log(`${roomNum}번 방에서 새로운 메시지 수신 : `, message);
            //         } catch (error) {
            //             console.error(`${roomNum}번 방에서 메시지 수신 오류`, error);
            //         }
            //     });
            // };

            // stompClient.current.connect({}, connectCallback);

            // return () => {
            //     if (subscriptionRef.current) {
            //         subscriptionRef.current.unsubscribe();
            //     }
            //     if (stompClient.current) {
            //         stompClient.current.disconnect();
            //     }
            // };
        }
    }, [roomNum]);

    const handleSendMessage = async (message: string) => {
        if (isGroupChat) {
            // 그룹 채팅에 대한 메시지 전송 로직이 필요하면 추가
        } else {
            const newMessage = {
                msg: message,
                sender: localStorage.getItem("userName"),
                senderId: localStorage.getItem("userId"),
                senderProfile: localStorage.getItem("userProfileImage"),
                roomNum: roomNum,
                createAt: new Date().toISOString(),
            };
            try {
                console.log(localStorage.getItem("userProfileImage"))
                console.log(JSON.stringify(newMessage));
                socket.current?.emit('sendMessage', JSON.stringify(newMessage));

                // stompClient.current?.send(`/topic/chat/send/${roomNum}`, {}, JSON.stringify(newMessage));
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Navigationbar />
            <div id="chat-box" className="flex-grow overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500">No messages yet</div>
                ) : (
                    messages.map((msg, index) => {
                        const nextMsg = messages[index + 1]; // 다음 메시지
                        const isLast =
                            !nextMsg ||  // 다음 메시지가 없거나
                            nextMsg.sender !== msg.sender ||  // 다음 메시지의 발신자가 현재 메시지의 발신자와 다르거나
                            new Date(msg.createAt).getMinutes() !== new Date(nextMsg.createAt).getMinutes(); // 분이 다르면
                        return (
                            <ChatMessage
                                key={index}
                                message={msg.msg}
                                sender={msg.sender}
                                senderId={msg.senderId}
                                senderProfile={msg.senderProfile}
                                isOwnMessage={msg.isOwnMessage}
                                timestamp={msg.createAt}
                                onDelete={() => { }} // 삭제 기능 필요시 추가
                                isLast={isLast}
                            />
                        )
                    })
                )}
            </div>
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatWindow;
