const STORAGE_KEYS = {
    note: 'blocoDeNotasNota',
    theme: 'blocoDeNotasTema',
};

const STATUS_MESSAGES = {
    saved: 'Última alteração salva agora',
    ready: 'Salvamento automático ativo',
    error: 'Não foi possível salvar localmente',
};

const SELECTORS = {
    note: '#blocoDeNotas',
    themeToggle: '#tema',
    counter: '#contadorCaracteres',
    status: '#statusSalvamento',
};

const blocoDeNotas = document.querySelector(SELECTORS.note);
const temaCheckbox = document.querySelector(SELECTORS.themeToggle);
const temaTexto = document.querySelector('#temaTexto');
const contadorCaracteres = document.querySelector(SELECTORS.counter);
const statusSalvamento = document.querySelector(SELECTORS.status);

let saveTimerId = null;

const isStorageAvailable = () => {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

const readStorage = (key) => {
    if (!isStorageAvailable()) return null;
    return localStorage.getItem(key);
};

const writeStorage = (key, value) => {
    if (!isStorageAvailable()) return false;
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        return false;
    }
};

const updateCounter = () => {
    contadorCaracteres.textContent = String(blocoDeNotas.value.length);
};

const updateStatus = (message) => {
    statusSalvamento.textContent = message;
};

const updateThemeLabel = (isDark) => {
    const labelText = isDark ? 'Modo escuro' : 'Modo claro';
    const ariaLabel = isDark ? 'Alternar para modo claro' : 'Alternar para modo escuro';
    if (temaTexto) temaTexto.textContent = labelText;
    if (temaCheckbox) temaCheckbox.setAttribute('aria-label', ariaLabel);
};

const applyTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    temaCheckbox.checked = isDark;
    updateThemeLabel(isDark);
    writeStorage(STORAGE_KEYS.theme, isDark ? 'dark' : 'light');
};

const loadTheme = () => {
    const savedTheme = readStorage(STORAGE_KEYS.theme);
    applyTheme(savedTheme === 'dark');
};

const loadNote = () => {
    const savedNote = readStorage(STORAGE_KEYS.note);
    if (savedNote !== null) {
        blocoDeNotas.value = savedNote;
    }
};

const saveNote = () => {
    const isSaved = writeStorage(STORAGE_KEYS.note, blocoDeNotas.value);
    updateStatus(isSaved ? STATUS_MESSAGES.saved : STATUS_MESSAGES.error);
};

const handleNoteInput = () => {
    updateCounter();
    updateStatus(STATUS_MESSAGES.ready);

    if (saveTimerId) {
        clearTimeout(saveTimerId);
    }

    saveTimerId = window.setTimeout(() => {
        saveNote();
        saveTimerId = null;
    }, 250);
};

const handleThemeChange = () => {
    applyTheme(temaCheckbox.checked);
};

const initialize = () => {
    loadNote();
    loadTheme();
    updateCounter();
    updateStatus(STATUS_MESSAGES.ready);

    blocoDeNotas.addEventListener('input', handleNoteInput);
    temaCheckbox.addEventListener('change', handleThemeChange);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
