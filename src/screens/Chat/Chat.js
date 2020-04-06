import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import * as firebase from 'firebase';

export const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(route.params.user);
  const [profile, setProfile] = useState(route.params.profile);

  const chatId = user.uid > profile.uid ? `${user.uid}-${profile.uid}` : `${profile.uid}-${user.uid}`;

  useEffect(() => {
    watchChat();
  }, []);

  const onSend = (messages) => {
    firebase
      .database()
      .ref('messages')
      .child(chatId)
      .push({ ...messages[0], createdAt: new Date().getTime() });
  };

  const watchChat = () => {
    firebase
      .database()
      .ref('messages')
      .child(chatId)
      .on('value', (snap) => {
        const messagesArr = [];

        snap.forEach((message) => {
          messagesArr.push(message.val());
        });
        setMessages(messagesArr.reverse());
      });
  };
  const avatar = `https://placeimg.com/140/140/any`;

  return <GiftedChat messages={messages} user={{ _id: user.uid, avatar }} onSend={onSend} />;
};
