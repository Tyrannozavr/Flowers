"""empty message

Revision ID: 4bfc64afa216
Revises: f8f3cbcfd247
Create Date: 2025-02-28 12:53:21.107579

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4bfc64afa216'
down_revision: Union[str, None] = 'f8f3cbcfd247'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_pays_id', table_name='pays')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('ix_pays_id', 'pays', ['id'], unique=False)
    # ### end Alembic commands ###
