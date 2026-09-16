(() => {
  const controls = document.getElementById('browse-controls');
  const search = document.getElementById('search');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.reading-card')].map(element => ({
    element,
    type: element.dataset.type,
    text: `${element.textContent} ${element.dataset.search}`.normalize('NFKC').toLocaleLowerCase('zh-Hant'),
  }));
  const count = document.getElementById('result-count');
  const empty = document.getElementById('empty-state');
  let selectedType = 'all';

  function updateCollection() {
    const terms = search.value.normalize('NFKC').trim().toLocaleLowerCase('zh-Hant').split(/\s+/u).filter(Boolean);
    let visibleCount = 0;
    for (const card of cards) {
      const matches = (selectedType === 'all' || card.type === selectedType)
        && terms.every(term => card.text.includes(term));
      card.element.hidden = !matches;
      if (matches) visibleCount += 1;
    }
    for (const button of buttons) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === selectedType));
    }
    count.textContent = selectedType === 'all' && terms.length === 0
      ? `顯示全部 ${cards.length} 篇`
      : `找到 ${visibleCount} 篇，共 ${cards.length} 篇`;
    empty.hidden = visibleCount !== 0;
  }

  for (const button of buttons) {
    button.addEventListener('click', () => {
      selectedType = button.dataset.filter;
      updateCollection();
    });
  }
  search.addEventListener('input', updateCollection);
  document.getElementById('reset-filters').addEventListener('click', () => {
    selectedType = 'all';
    search.value = '';
    updateCollection();
    search.focus();
  });
  updateCollection();
  controls.hidden = false;
})();
