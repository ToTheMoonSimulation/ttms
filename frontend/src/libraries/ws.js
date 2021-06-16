const WS = new WebSocket('wss://api.upbit.com/websocket/v1');
WS.binaryType="arraybuffer";

export default WS;