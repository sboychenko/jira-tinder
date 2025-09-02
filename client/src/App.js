import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SettingsModal from './SettingsModal';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [jqlQuery, setJqlQuery] = useState('project = "YOUR_PROJECT" AND status != "Done" ORDER BY created DESC');
  const [isLoading, setIsLoading] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    jiraUrl: '',
    jiraToken: '',
    taskLimit: 50
  });

  const fetchTasks = async () => {
    if (!jqlQuery.trim()) {
      toast.error('Введите JQL запрос');
      return;
    }

    setIsLoading(true);
    try {
      if (!settings.jiraUrl || !settings.jiraToken) {
        toast.error('Сначала настройте Jira в настройках!');
        return;
      }

      const response = await axios.post('/api/tasks', { 
        jql: jqlQuery, 
        maxResults: settings.taskLimit || 50,
        jiraConfig: {
          baseURL: settings.jiraUrl,
          apiToken: settings.jiraToken
        }
      });
      setTasks(response.data.tasks);
      setCurrentTaskIndex(0);
      toast.success(`Загружено ${response.data.tasks.length} задач (лимит: ${settings.taskLimit || 50})`);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Ошибка при загрузке задач');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwipe = useCallback(async (direction) => {
    if (currentTaskIndex >= tasks.length) return;

    const currentTask = tasks[currentTaskIndex];
    const label = direction === 'right' ? 'run' : 'change';

    try {
      await axios.post(`/api/tasks/${currentTask.id}/label`, { 
        label,
        jiraConfig: {
          baseURL: settings.jiraUrl,
          apiToken: settings.jiraToken
        }
      });
      toast.success(`Лейбл "${label}" добавлен к задаче ${currentTask.id}`);
    } catch (error) {
      console.error('Error adding label:', error);
      toast.error('Ошибка при добавлении лейбла');
    }

    // Animate card out
    setCurrentDirection(direction);
    
    // Move to next task after animation
    setTimeout(() => {
      setCurrentTaskIndex(prev => prev + 1);
      setCurrentDirection(null);
    }, 300);
  }, [currentTaskIndex, tasks, settings.jiraUrl, settings.jiraToken]);

  const handleSkip = useCallback(() => {
    if (currentTaskIndex >= tasks.length) return;

    const currentTask = tasks[currentTaskIndex];
    
    // Показываем уведомление о пропуске
    toast.success(`Задача ${currentTask.id} пропущена`);
    
    // Animate card out with skip animation
    setCurrentDirection('skip');
    
    // Move to next task after animation
    setTimeout(() => {
      setCurrentTaskIndex(prev => prev + 1);
      setCurrentDirection(null);
    }, 300);
  }, [currentTaskIndex, tasks]);

  const handleSettingsSave = useCallback((newSettings) => {
    setSettings(newSettings);
    
    // Сохраняем в localStorage
    localStorage.setItem('jiraSettings', JSON.stringify(newSettings));
    
    toast.success('Настройки сохранены!');
  }, []);

  const openSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    } else if (e.key === 'ArrowRight') {
      handleSwipe('right');
    } else if (e.key === 'ArrowDown') {
      handleSkip();
    }
  }, [handleSwipe, handleSkip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTaskIndex, tasks, handleKeyPress]);

  // Загружаем настройки при инициализации
  useEffect(() => {
    const savedSettings = localStorage.getItem('jiraSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  const currentTask = tasks[currentTaskIndex];

  return (
    <div className="app">
      <Toaster position="top-center" />
      
      <header className="header">
        <div className="header-content">
          <div className="header-text">
            <h1>Jira Tinder</h1>
            <p>Свайпайте задачи: влево для Change, вправо для Run</p>
          </div>
          <button onClick={openSettings} className="settings-button">
            ⚙️ Настройки
          </button>
        </div>
      </header>

      <div className="jql-section">
        <div className="jql-input-group">
          <input
            type="text"
            value={jqlQuery}
            onChange={(e) => setJqlQuery(e.target.value)}
            placeholder="Введите JQL запрос..."
            className="jql-input"
          />
          <button 
            onClick={fetchTasks} 
            disabled={isLoading}
            className="fetch-button"
          >
            {isLoading ? 'Загрузка...' : 'Загрузить задачи'}
          </button>
        </div>
      </div>

      <main className="main-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Нет задач для просмотра</h3>
            <p>Введите JQL запрос и загрузите задачи для начала работы</p>
          </div>
        ) : currentTaskIndex >= tasks.length ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>Все задачи обработаны!</h3>
            <p>Вы просмотрели все {tasks.length} задач</p>
            <button 
              onClick={() => setCurrentTaskIndex(0)} 
              className="restart-button"
            >
              Начать заново
            </button>
          </div>
        ) : (
          <div className="card-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTask.id}
                className={`task-card ${currentDirection ? `swipe-${currentDirection}` : ''}`}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ 
                  x: currentDirection === 'left' ? -300 : 
                      currentDirection === 'right' ? 300 : 0,
                  y: currentDirection === 'skip' ? 300 : 0,
                  opacity: 0,
                  scale: 0.8
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="card-header">
                  <div className="task-id">{currentTask.id}</div>
                  <div className="task-type">{currentTask.issueType}</div>
                  <div className="task-priority">{currentTask.priority}</div>
                </div>
                
                <h2 className="task-summary">{currentTask.summary}</h2>
                
                <div className="task-description">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Ограничиваем размер заголовков
                      h1: ({node, ...props}) => <h3 {...props}>{props.children}</h3>,
                      h2: ({node, ...props}) => <h4 {...props}>{props.children}</h4>,
                      h3: ({node, ...props}) => <h5 {...props}>{props.children}</h5>,
                      // Ограничиваем размер изображений
                      img: ({node, ...props}) => <img {...props} alt={props.alt || 'Image'} style={{maxWidth: '100%', height: 'auto'}} />,
                      // Стилизуем ссылки
                      a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" style={{color: '#1976d2', textDecoration: 'underline'}}>{props.children}</a>,
                      // Стилизуем код
                      code: ({node, inline, ...props}) => 
                        inline ? 
                          <code {...props} style={{backgroundColor: '#f5f5f5', padding: '2px 4px', borderRadius: '3px', fontFamily: 'monospace'}}>{props.children}</code> :
                          <pre {...props} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto'}}>{props.children}</pre>,
                      // Стилизуем блоки кода
                      pre: ({node, ...props}) => <pre {...props} style={{backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', overflow: 'auto'}}>{props.children}</pre>
                    }}
                  >
                    {currentTask.description.length > 500 
                      ? `${currentTask.description.substring(0, 500)}...` 
                      : currentTask.description
                    }
                  </ReactMarkdown>
                </div>
                
                <div className="task-meta">
                  <div className="task-assignee">
                    <strong>Назначен:</strong> {currentTask.assignee}
                  </div>
                  
                  <div className="task-reporter">
                    <strong>Создатель:</strong> {currentTask.reporter}
                  </div>
                  
                  <div className="task-components">
                    <strong>Компоненты:</strong>
                    {currentTask.components.length > 0 
                      ? currentTask.components.join(', ') 
                      : 'Не указаны'
                    }
                  </div>
                  
                  <div className="task-estimate">
                    <strong>Оценка:</strong> {currentTask.timeEstimate ? `${Math.round(currentTask.timeEstimate / 3600)}ч` : 'Не оценена'}
                  </div>
                </div>
                
                <a 
                  href={currentTask.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="task-link"
                >
                  Открыть в Jira →
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

              {currentTask && (
          <div className="swipe-controls">
            <button 
              onClick={() => handleSwipe('left')}
              className="swipe-button swipe-left"
              disabled={currentTaskIndex >= tasks.length}
            >
              <span className="swipe-icon">🔄</span>
              <span className="swipe-text">Change</span>
            </button>
            
            <div className="task-counter">
              {currentTaskIndex + 1} из {tasks.length}
            </div>
            
            <button 
              onClick={() => handleSwipe('right')}
              className="swipe-button swipe-right"
              disabled={currentTaskIndex >= tasks.length}
            >
              <span className="swipe-icon">▶️</span>
              <span className="swipe-text">Run</span>
            </button>
          </div>
        )}
        
        {currentTask && (
          <div className="skip-controls">
            <button 
              onClick={handleSkip}
              className="skip-button"
              disabled={currentTaskIndex >= tasks.length}
            >
              <span className="skip-icon">⏭️</span>
              <span className="skip-text">Пропустить</span>
            </button>
          </div>
        )}

      <div className="keyboard-hints">
        <p>Используйте клавиши ← (Change), → (Run) и ↓ (Пропустить) для быстрого управления</p>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        onSave={handleSettingsSave}
        settings={settings}
      />
    </div>
  );
}

export default App;
