export default function PageHeader({ icon: Icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {Icon && (
          <div
            style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: 'var(--grad-brand)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-btn)',
            }}
          >
            <Icon size={22} color="#fff" />
          </div>
        )}
        <div>
          <h2 style={{ fontSize: 26 }}>{title}</h2>
          {description && <p style={{ marginTop: 4, fontSize: 14.5, color: 'var(--text-soft)' }}>{description}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
