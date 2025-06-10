import React from 'react';
import { Tag } from 'antd';
import { CulturalClassCategory } from '../../interfaces/culturalClass';

interface ClassCategoryBadgeProps {
  category: CulturalClassCategory;
}

const ClassCategoryBadge: React.FC<ClassCategoryBadgeProps> = ({ category }) => {
  const getColor = (cat: CulturalClassCategory) => {
    switch (cat) {
      case CulturalClassCategory.DANCE: return 'blue';
      case CulturalClassCategory.THEATER: return 'purple';
      case CulturalClassCategory.SINGING: return 'green';
      case CulturalClassCategory.INSTRUMENTS: return 'orange';
      default: return 'default';
    }
  };

  return (
    <Tag color={getColor(category)}>
      {category.replace(/_/g, ' ')}
    </Tag>
  );
};

export default ClassCategoryBadge;