from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Функция для хеширования пароля
def hash_password(password: str) -> str:
    """
    Функция для хеширования пароля.
    :param password: строка с паролем
    :return: хешированный пароль
    """
    return pwd_context.hash(password)

# Функция для проверки пароля
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Функция для проверки пароля.
    :param plain_password: введённый пароль
    :param hashed_password: хешированный пароль из базы данных
    :return: True, если пароли совпадают, иначе False
    """
    return pwd_context.verify(plain_password, hashed_password)
