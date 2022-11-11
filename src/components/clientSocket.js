import { useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { SERVER_URL_HEROKU, LIVE_STRIPE_SERVER } from "../Constants";
import { confirmPayment } from '../actions/index';

export const useClientSocket = ({paymentIntentId, enabled }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  const joinRoomForPayment = (paymentIntentId) => {
    ref.current?.emit("join_p_room", {
        paymentIntentId: paymentIntentId
    }, (response) => {
        console.log("server join payment room response", response); 
    });
  }

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const socket = io(LIVE_STRIPE_SERVER, {});

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on("connect", () => {
        console.log("socket id:", socket.id)

        const engine = socket.io.engine;
        console.log("transport before upgrade:", engine.transport.name)

        engine.once("upgrade", () => {
           console.log("transport after upgrade:", engine.transport.name)
        })

        if (paymentIntentId) {
          joinRoomForPayment(paymentIntentId);
        }
    })

    socket.on('reconnect', () => {
      if (paymentIntentId) {
        joinRoomForPayment(paymentIntentId);
      }

      console.log('reconnected');
    });

    socket.on('message', (message) => {
      console.log('message:', message);
    });

    // FROM SERVER:STRIPE: announcements for customer 
    socket.on('p_intent', (payload) => {
        setTimeout(() => {
            console.log("Your payment was successful", payload);
            dispatch(confirmPayment(payload));
        }, 3000);
    });

    ref.current = socket;

    // disconnect after component unmount
    return () => socket.disconnect();
  }, [enabled, paymentIntentId]);

  return [joinRoomForPayment]
};
