"""empty message

Revision ID: 1731e4f98d0c
Revises: 0bda85e404e1
Create Date: 2025-04-21 10:41:26.930901

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


# revision identifiers, used by Alembic.
revision: str = '1731e4f98d0c'
down_revision: Union[str, None] = '0bda85e404e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    conn = op.get_bind()
    inspector = inspect(conn)
    columns = inspector.get_columns('users')
    if not any(column['name'] == 'email' for column in columns):
        op.add_column('users', sa.Column('email', sa.String(), nullable=True))
    op.create_unique_constraint(None, 'users', ['email'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'email')
    # ### end Alembic commands ###
