'use client';

const colors = ['#FF7A59', '#FFD93D', '#5ED3F3', '#6BCB77', '#9B8AFB', '#FF8DC7', '#000000', '#FFFFFF', '#F97316', '#3B82F6', '#10B981', '#EF4444'];

export default function ColorPalette({ selected, onSelect }: { selected: string; onSelect: (c: string) => void }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          aria-label={`Select ${c}`}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '3px solid white',
            background: c,
            boxShadow: selected === c ? '0 0 0 4px #243b53, 0 4px 8px rgba(0,0,0,0.15)' : '0 4px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer'
          }}
        />
      ))}
    </div>
  );
}
