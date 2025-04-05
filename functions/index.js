const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Função HTTP em vez de função callable para facilitar o teste
exports.enviarEmailConvite = functions.https.onRequest(async (req, res) => {
  try {
    // Permitir CORS
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(204).send('');
      return;
    }

    // Obter dados do corpo da requisição
    const { destinatario, nome, link } = req.body;

    if (!destinatario || !nome || !link) {
      res.status(400).send({ error: 'Parâmetros incompletos' });
      return;
    }

    // Configure o transportador de email usando variáveis de ambiente
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass
      }
    });

    const mailOptions = {
      from: `Casamento Kauã e Kimilly <${functions.config().email.user}>`,
      to: destinatario,
      subject: 'Convite para nosso casamento!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá ${nome}!</h2>
          <p>Temos a alegria de convidá-lo para celebrar conosco o nosso casamento!</p>
          <p>Para confirmar sua presença, por favor acesse o link abaixo:</p>
          <p><a href="${link}" style="display: inline-block; background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Confirmar Presença</a></p>
          <p>Ficaremos muito felizes com sua presença!</p>
          <p>Atenciosamente,<br>Kauã e Kimilly</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).send({ error: 'Erro ao enviar email' });
  }
});