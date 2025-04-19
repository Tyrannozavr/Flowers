"""email

Revision ID: 67b70a2464c0
Revises: d12c59132d59
Create Date: 2025-04-19 12:19:43.730910

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '67b70a2464c0'
down_revision: Union[str, None] = 'd12c59132d59'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
