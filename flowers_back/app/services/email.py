import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

class EmailNotification:
    def __init__(self, smtp_server: str, smtp_port: int, sender_email: str, sender_password: str):
        self._smtp_server = smtp_server
        self._smtp_port = smtp_port
        self._sender_email = sender_email
        self._sender_password = sender_password

    def _render_message(self, login: str, password: str, base_url: str) -> str:
        message = f"""
        <h2>Добро пожаловать! Вы успешно зарегистрировались на flourum.ru.</h2>
        <p>Ваши учетные данные:</p>
        <p><strong>Логин:</strong> {login}</p>
        <p><strong>Пароль:</strong> {password}</p>
        <p>Вы можете войти в систему, используя эту ссылку: <a href="{base_url}/login">{base_url}/login</a></p>
        """
        return message

    async def send_email(self, login: str, password: str, email: str, base_url: str):
        subject = "Регистрация успешно завершена"
        html_content = self._render_message(login, password, base_url)

        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self._sender_email
            message["To"] = email

            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            print(f"Sending message to email {email}: {html_part}")
            # with smtplib.SMTP(self._smtp_server, self._smtp_port) as server:
            #     server.starttls()
            #     server.login(self._sender_email, self._sender_password)
            #     server.sendmail(self._sender_email, email, message.as_string())

            print(f"Письмо с регистрационными данными отправлено на адрес {email}")
        except Exception as e:
            print(f"Не удалось отправить письмо с регистрационными данными на адрес {email}: {str(e)}")

    async def send_error(self, err: str, recipient_email: str):
        subject = "Ошибка в приложении flourum.ru"
        html_content = f"""
        <h2>Произошла ошибка</h2>
        <pre>{err}</pre>
        """

        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self._sender_email
            message["To"] = recipient_email

            html_part = MIMEText(html_content, "html")
            message.attach(html_part)

            with smtplib.SMTP(self._smtp_server, self._smtp_port) as server:
                server.starttls()
                server.login(self._sender_email, self._sender_password)
                server.sendmail(self._sender_email, recipient_email, message.as_string())

            print(f"Уведомление об ошибке отправлено на адрес {recipient_email}")
        except Exception as e:
            print(f"Не удалось отправить уведомление об ошибке: {str(e)}")

    async def close(self):
        # Нет необходимости закрывать что-либо для email, но оставляем метод для согласованности
        pass