import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, onSave, settings }) => {
  const [localSettings, setLocalSettings] = useState({
    jiraUrl: '',
    jiraToken: '',
    taskLimit: 50
  });

  useEffect(() => {
    if (isOpen && settings) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localSettings);
    onClose();
  };

  const handleCancel = () => {
    setLocalSettings(settings || { jiraUrl: '', jiraToken: '', taskLimit: 50 });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Настройки Jira</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="jiraUrl">URL Jira сервера:</label>
            <input
              type="url"
              id="jiraUrl"
              name="jiraUrl"
              value={localSettings.jiraUrl}
              onChange={handleInputChange}
              placeholder="https://your-jira-instance.com"
              required
            />
            <small>Полный URL вашего Jira сервера</small>
          </div>

          <div className="form-group">
            <label htmlFor="jiraToken">API токен Jira:</label>
            <input
              type="password"
              id="jiraToken"
              name="jiraToken"
              value={localSettings.jiraToken}
              onChange={handleInputChange}
              placeholder="Введите ваш API токен"
              required
            />
            <small>API токен для аутентификации в Jira</small>
          </div>

          <div className="form-group">
            <label htmlFor="taskLimit">Лимит задач по умолчанию:</label>
            <input
              type="number"
              id="taskLimit"
              name="taskLimit"
              value={localSettings.taskLimit}
              onChange={handleInputChange}
              min="1"
              max="1000"
              required
            />
            <small>Количество задач для загрузки по умолчанию (1-1000)</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              Отмена
            </button>
            <button type="submit" className="save-button">
              Сохранить
            </button>
          </div>
        </form>

        <div className="settings-help">
          <h4>💡 Как получить API токен:</h4>
          <ol>
            <li>Войдите в свой аккаунт Jira</li>
            <li>Перейдите в Profile → Personal Access Tokens</li>
            <li>Нажмите "Create token"</li>
            <li>Скопируйте токен и вставьте его выше</li>
          </ol>
          <p><strong>Примечание:</strong> Токен отображается только один раз!</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
