"""empty message

Revision ID: 8160c6218198
Revises: 37163bf6da52, c83091072288
Create Date: 2025-04-28 05:59:40.224797

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8160c6218198'
down_revision: Union[str, None] = ('37163bf6da52', 'c83091072288')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
