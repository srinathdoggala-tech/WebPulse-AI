from abc import ABC, abstractmethod
from typing import List
import logging
from app.models.schema import CollectedItem

logger = logging.getLogger(__name__)

class BaseCollector(ABC):
    def __init__(self, source_name: str):
        self.source_name = source_name

    @abstractmethod
    def collect(self) -> List[CollectedItem]:
        """Fetch and return raw items from source."""
        pass
