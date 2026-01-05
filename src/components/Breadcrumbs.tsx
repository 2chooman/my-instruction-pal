import { useNavigate } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => item.path && navigate(item.path)}
          disabled={!item.path}
          style={{
            background: '#f5f5f5',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: item.path ? 'pointer' : 'default',
            fontSize: '14px',
            fontFamily: 'Times New Roman, serif',
            opacity: item.path ? 1 : 0.7,
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => {
            if (item.path) e.currentTarget.style.background = '#eee';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
        >
          {item.path ? '‹ ' : ''}{item.label}
        </button>
      ))}
    </div>
  );
}
