document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const allFilterBtn = document.getElementById('all-filter');
  const activeFilterBtn = document.getElementById('active-filter');
  const completedFilterBtn = document.getElementById('completed-filter');

  let currentFilter = 'all';

  // Add a message element for empty state
  const emptyMsg = document.createElement('li');
  emptyMsg.textContent = 'There are no tasks.';
  emptyMsg.style.textAlign = 'center';
  emptyMsg.style.opacity = '0.7';
  emptyMsg.style.listStyle = 'none';

  function saveTasks() {
    const tasks = [];
    list.querySelectorAll('.todo-item').forEach(item => {
      tasks.push({
        text: item.querySelector('span').textContent,
        completed: item.classList.contains('completed'),
        timestamp: item.dataset.timestamp
      });
    });
    localStorage.setItem('todos', JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('todos')) || [];
    list.innerHTML = ''; // Clear current list
    tasks.forEach(task => {
      const todoItem = createTodoItem(task.text, task.timestamp);
      if (task.completed) {
        todoItem.classList.add('completed');
      }
      // Apply filter
      if (currentFilter === 'all' ||
          (currentFilter === 'active' && !task.completed) ||
          (currentFilter === 'completed' && task.completed)) {
        list.prepend(todoItem);
      }
    });
    updateEmptyState();
  }

  function updateEmptyState() {
    if (list.children.length === 0) {
      list.appendChild(emptyMsg);
    } else if (list.contains(emptyMsg)) {
      list.removeChild(emptyMsg);
    }
  }

  function createTodoItem(text, timestamp = new Date().toISOString()) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.timestamp = timestamp;

    const label = document.createElement('label');
    label.className = 'todo-label';
    label.htmlFor = `todo-${Date.now()}`;

    const span = document.createElement('span');
    span.textContent = text;
    label.appendChild(span);
    li.appendChild(label);

    const infoActions = document.createElement('div');
    infoActions.className = 'todo-info-actions';

    const timeSpan = document.createElement('span');
    timeSpan.className = 'timestamp';
    timeSpan.textContent = new Date(timestamp).toLocaleString();
    infoActions.appendChild(timeSpan);

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'todo-checkbox';
    checkbox.id = label.htmlFor;
    checkbox.checked = li.classList.contains('completed');
    checkbox.onchange = function() {
      li.classList.toggle('completed');
      saveTasks();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'todo-delete-btn';
    deleteBtn.textContent = '✗';
    deleteBtn.title = 'Delete task';
    deleteBtn.onclick = function() {
      li.classList.add('removing');
      li.addEventListener('transitionend', () => {
        li.remove();
        updateEmptyState();
        saveTasks();
      }, { once: true });
    };

    actions.appendChild(checkbox);
    actions.appendChild(deleteBtn);
    infoActions.appendChild(actions);
    li.appendChild(infoActions);
    return li;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
      const todoItem = createTodoItem(value);
      list.prepend(todoItem);
      input.value = '';
      input.focus();
      updateEmptyState();
      saveTasks();
    } else {
      input.classList.add('shake');
      input.addEventListener('animationend', () => {
        input.classList.remove('shake');
      }, { once: true });
    }
  });

  // Initial load of tasks
  loadTasks();

  allFilterBtn.addEventListener('click', () => {
    currentFilter = 'all';
    allFilterBtn.classList.add('active');
    activeFilterBtn.classList.remove('active');
    completedFilterBtn.classList.remove('active');
    loadTasks();
  });

  activeFilterBtn.addEventListener('click', () => {
    currentFilter = 'active';
    allFilterBtn.classList.remove('active');
    activeFilterBtn.classList.add('active');
    completedFilterBtn.classList.remove('active');
    loadTasks();
  });

  completedFilterBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    allFilterBtn.classList.remove('active');
    activeFilterBtn.classList.remove('active');
    completedFilterBtn.classList.add('active');
    loadTasks();
  });

  // Theme toggle logic
  function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light-mode') {
      document.body.classList.add('light-mode');
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light-mode');
    } else {
      localStorage.setItem('theme', 'dark-mode');
    }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  // Initial theme load
  loadTheme();
});

list.addEventListener('click', function(e) {
  if (e.target.classList.contains('todo-checkbox')) {
    e.target.closest('.todo-item').classList.toggle('completed');
    saveTasks();
  } else if (e.target.classList.contains('todo-delete-btn')) {
    const li = e.target.closest('.todo-item');
    li.classList.add('removing');
    li.addEventListener('transitionend', () => {
      li.remove();
      updateEmptyState();
      saveTasks();
    }, { once: true });
  }
});
list.addEventListener('click', function(e) {
  if (e.target.classList.contains('todo-checkbox')) {
    e.target.closest('.todo-item').classList.toggle('completed');
    saveTasks();
  } else if (e.target.classList.contains('todo-delete-btn')) {
    const li = e.target.closest('.todo-item');
    li.classList.add('removing');
    li.addEventListener('transitionend', () => {
      li.remove();
      updateEmptyState();
      saveTasks();
    }, { once: true });
  }
});