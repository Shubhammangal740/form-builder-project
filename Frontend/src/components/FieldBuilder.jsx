import React, { useState } from 'react';

const FieldBuilder = ({ field, onUpdate, onRemove, index }) => {
  const [newOption, setNewOption] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate(field.id, {
      ...field,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddOption = () => {
    const trimmedOption = newOption.trim();
    if (!trimmedOption) return;
    if (field.options?.includes(trimmedOption)) return;

    onUpdate(field.id, {
      ...field,
      options: [...(field.options || []), trimmedOption]
    });
    setNewOption('');
  };

  const handleRemoveOption = (optionToRemove) => {
    onUpdate(field.id, {
      ...field,
      options: field.options.filter(opt => opt !== optionToRemove)
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  const needsOptions = ['dropdown', 'radio', 'checkbox'].includes(field.type);

  return (
    <div className="card field-builder-item" style={{ 
      padding: '1.5rem', 
      marginBottom: '1.5rem', 
      borderLeft: '4px solid var(--primary)', 
      borderRadius: 'var(--radius-lg)', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
      transition: 'all 0.2s', 
      background: 'var(--surface)' 
    }}>
      <div className="flex-between mb-4" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
        <h4 className="mb-0" style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>#{index !== undefined ? index + 1 : '-'}</span> Configuration
        </h4>
        <button 
          className="btn-danger" 
          onClick={() => onRemove(field.id)} 
          title="Remove Field"
          type="button"
          style={{ width: '30px', height: '30px', fontSize: '1.25rem' }}
        >
          &times;
        </button>
      </div>

      <div className="grid grid-2 mb-4" style={{ gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div>
          <label className="form-label text-sm" style={{ fontWeight: '600' }}>Field Label <span className="text-danger">*</span></label>
          <input
            type="text"
            name="label"
            className="form-input"
            value={field.label}
            onChange={handleChange}
            placeholder="e.g. Full Name"
            style={{ fontWeight: '500', padding: '0.6rem 0.8rem' }}
          />
        </div>
        <div>
          <label className="form-label text-sm" style={{ fontWeight: '600' }}>Field Type</label>
          <select
            name="type"
            className="form-input"
            value={field.type}
            onChange={handleChange}
            style={{ padding: '0.6rem 0.8rem', cursor: 'pointer', backgroundPosition: 'right 0.75rem center' }}
          >
            <option value="text">Short Text (&#128196;)</option>
            <option value="textarea">Paragraph (&#128221;)</option>
            <option value="number">Number (🔢)</option>
            <option value="email">Email (&#128231;)</option>
            <option value="dropdown">Dropdown Select (&#128315;)</option>
            <option value="radio">Radio Buttons (&#128306;)</option>
            <option value="checkbox">Multiple Choice (&#9745;)</option>
          </select>
        </div>
      </div>

      <div className="form-group mb-4">
        <label className="flex-start w-full" style={{ 
          cursor: 'pointer', 
          width: 'max-content',
          padding: '0.5rem 0.75rem',
          background: field.required ? 'var(--primary)' : '#f1f5f9',
          color: field.required ? 'white' : 'var(--text-main)',
          borderRadius: 'var(--radius-md)',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}>
          <input
            type="checkbox"
            name="required"
            checked={field.required}
            onChange={handleChange}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'white' }}
          />
          <span className="text-sm ml-2">{field.required ? 'Required Field' : 'Make Optional'}</span>
        </label>
      </div>

      {needsOptions && (
        <div className="options-section bg-light" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', marginTop: '0.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
          <label className="form-label text-sm" style={{ fontWeight: '600', marginBottom: '0.75rem' }}>Options Configuration</label>
          
          <div className="flex-start mb-3">
            <input
              type="text"
              className="form-input w-full"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Type an option and press Enter..."
              onKeyDown={handleKeyDown}
              style={{ padding: '0.6rem 0.8rem' }}
            />
            <button 
              className="btn btn-primary ml-2 py-2" 
              onClick={handleAddOption} 
              type="button" 
              style={{ fontWeight: '600', padding: '0.6rem 1.25rem' }}
            >
              Add
            </button>
          </div>
          
          {field.options && field.options.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {field.options.map((opt, idx) => (
                <li key={idx} className="flex-between" style={{ padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', animation: 'fadeIn 0.2s ease-out' }}>
                  <span className="text-sm font-medium" style={{ fontWeight: '500' }}>{opt}</span>
                  <button 
                    className="btn-danger btn-sm" 
                    onClick={() => handleRemoveOption(opt)} 
                    type="button" 
                    style={{ width: '26px', height: '26px', fontSize: '1rem', background: 'transparent', color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}>
              <p className="text-sm mt-0 mb-0 font-medium">&#9888; At least one option is required. Type an option above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FieldBuilder;
