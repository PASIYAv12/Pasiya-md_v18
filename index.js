```js
import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys';
import axios from 'axios';
import cron from 'node-cron';

const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);

  const sendBTCUpdate = async () => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
      const btc = res.data.bitcoin;
      const msg = `*📊 BTC Market Update*\n\nPrice: 
    
{btc.usd}\n24h Change: ${btc.usd_24h_change.toFixed(2)}%`;

      await sock.sendMessage('94766359869@s.whatsapp.net', { text: msg });
    } catch (err) {
      console.error('BTC fetch error:', err);
    }
  };

  cron.schedule('0 */7 * * *', sendBTCUpdate);
  sendBTCUpdate();
};

startBot();
```
