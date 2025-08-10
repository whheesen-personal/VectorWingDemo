(function () {
  const { useState, useEffect, useMemo, useRef } = React;
  const M = MaterialUI;
  const MI = MaterialUIIcons;

  function useNow() {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
      const id = setInterval(() => setNow(new Date()), 60000);
      return () => clearInterval(id);
    }, []);
    return now;
  }

  function App() {
    const now = useNow();
    const [view, setView] = useState('day');
    const [date, setDate] = useState(() => new Date());
    const [filters, setFilters] = useState({ showJets: true, showSims: true });
    const [items, setItems] = useState(() => demoItems(date));
    const [groups] = useState(() => demoGroups());
    const [selectedItem, setSelectedItem] = useState(null);
    const [snack, setSnack] = useState({ open: false, message: '' });
    const timelineRef = useRef(null);
    const visInstance = useRef(null);

    const visibleItems = useMemo(() => {
      return items.filter((it) => {
        const g = groups.find((g) => g.id === it.group);
        if (!g) return false;
        if (g.type === 'aircraft' && !filters.showJets) return false;
        if (g.type === 'sim' && !filters.showSims) return false;
        return true;
      });
    }, [items, groups, filters]);

    useEffect(() => {
      // Initialize vis timeline once
      if (!timelineRef.current || visInstance.current) return;
      const container = timelineRef.current;
      const dataGroups = new vis.DataSet(groups);
      const dataItems = new vis.DataSet(visibleItems);
      const options = buildVisOptions(view, date);
      const timeline = new vis.Timeline(container, dataItems, dataGroups, options);

      // Handlers
      timeline.on('doubleClick', (props) => {
        if (props.item) {
          setSelectedItem(dataItems.get(props.item));
        }
      });
      timeline.on('itemoverlap', () => {}); // placeholder
      timeline.on('rangechanged', (ev) => {
        // keep internal date in sync when user pans
        const start = new Date(ev.start);
        setDate(start);
      });
      timeline.on('itemmoved', (ev) => {
        setItems((prev) => {
          const next = prev.map((p) => (p.id === ev.item ? { ...p, start: ev.start, end: ev.end } : p));
          return markConflicts(next);
        });
      });
      timeline.on('itemresized', (ev) => {
        setItems((prev) => {
          const next = prev.map((p) => (p.id === ev.item ? { ...p, start: ev.start, end: ev.end } : p));
          return markConflicts(next);
        });
      });

      visInstance.current = { timeline, dataItems, dataGroups };
    }, [groups, visibleItems, view, date]);

    useEffect(() => {
      // Update data on filter/items/view changes
      const inst = visInstance.current;
      if (!inst) return;
      inst.dataGroups.update(groups);
      inst.dataItems.clear();
      inst.dataItems.add(visibleItems);
      inst.timeline.setOptions(buildVisOptions(view, date));

      // Apply conflict class
      setTimeout(() => applyConflictClasses(inst.timeline, items), 0);
    }, [groups, visibleItems, items, view, date]);

    function handleAuthorize(itemId) {
      setItems((prev) => prev.map((p) => (p.id === itemId ? { ...p, status: 'Authorized' } : p)));
      setSelectedItem(null);
      setSnack({ open: true, message: 'Mission authorized' });
    }

    function handleCancel(itemId) {
      setItems((prev) => prev.map((p) => (p.id === itemId ? { ...p, status: 'Canceled' } : p)));
      setSelectedItem(null);
      setSnack({ open: true, message: 'Mission canceled' });
    }

    function handlePublish() {
      setSnack({ open: true, message: 'Day published (demo)' });
    }

    function handleExport() {
      setSnack({ open: true, message: 'Exported PDF (demo)' });
    }

    return (
      React.createElement('div', { className: 'app-shell' },
        React.createElement(M.AppBar, { position: 'static', color: 'transparent', elevation: 0, sx: { borderBottom: '1px solid #243049' } },
          React.createElement(M.Toolbar, null,
            React.createElement(MI.FlightTakeoff, { sx: { mr: 1, color: 'primary.main' } }),
            React.createElement(M.Typography, { variant: 'h6', sx: { flexGrow: 1 } }, 'Flight Training Scheduler'),
            React.createElement(M.Chip, { label: 'Prototype', color: 'info', size: 'small', variant: 'outlined' })
          )
        ),
        React.createElement('div', { className: 'content' },
          React.createElement('div', { className: 'sidebar' },
            React.createElement(M.Stack, { spacing: 2 },
              React.createElement(M.Typography, { variant: 'subtitle1' }, 'Filters'),
              React.createElement(M.FormGroup, null,
                React.createElement(M.FormControlLabel, {
                  control: React.createElement(M.Switch, { checked: filters.showJets, onChange: (e) => setFilters((f) => ({ ...f, showJets: e.target.checked })) }),
                  label: 'Show Aircraft'
                }),
                React.createElement(M.FormControlLabel, {
                  control: React.createElement(M.Switch, { checked: filters.showSims, onChange: (e) => setFilters((f) => ({ ...f, showSims: e.target.checked })) }),
                  label: 'Show Simulators'
                })
              ),
              React.createElement(M.Divider, { sx: { my: 1 } }),
              React.createElement(M.Typography, { variant: 'subtitle1' }, 'Date Range'),
              React.createElement(M.ToggleButtonGroup, { exclusive: true, value: view, onChange: (_e, v) => v && setView(v) },
                React.createElement(M.ToggleButton, { value: 'day' }, 'Day'),
                React.createElement(M.ToggleButton, { value: 'week' }, 'Week')
              ),
              React.createElement(M.Alert, { severity: 'info', variant: 'outlined' }, 'Double-click a mission for details')
            )
          ),
          React.createElement('div', { className: 'main' },
            React.createElement('div', { className: 'toolbar' },
              React.createElement(M.Button, { variant: 'contained', color: 'primary', startIcon: React.createElement(MI.Publish), onClick: handlePublish }, 'Publish Day'),
              React.createElement(M.Button, { variant: 'outlined', color: 'inherit', startIcon: React.createElement(MI.PictureAsPdf), onClick: handleExport }, 'Export PDF'),
              React.createElement('div', { style: { flex: 1 } }),
              React.createElement(M.Chip, { label: labelForDate(date, view), icon: React.createElement(MI.CalendarMonth), variant: 'outlined', color: 'default' })
            ),
            React.createElement('div', { className: 'timeline-wrap' },
              React.createElement('div', { id: 'timeline', ref: timelineRef, style: { height: '100%', minHeight: 400, background: 'transparent' } })
            )
          )
        ),
        selectedItem && React.createElement(M.Dialog, { open: true, onClose: () => setSelectedItem(null), maxWidth: 'sm', fullWidth: true },
          React.createElement(M.DialogTitle, null, 'Mission ', selectedItem?.title,
            selectedItem?.status === 'Authorized' && React.createElement('span', { className: 'badge success' }, 'Authorized'),
            selectedItem?.status === 'Canceled' && React.createElement('span', { className: 'badge warn' }, 'Canceled')
          ),
          React.createElement(M.DialogContent, null,
            React.createElement(M.Stack, { spacing: 1 },
              React.createElement(M.Typography, { variant: 'body2', color: 'text.secondary' }, 'Resource: ', groupName(groups, selectedItem.group)),
              React.createElement(M.Typography, { variant: 'body2', color: 'text.secondary' }, 'Start: ', new Date(selectedItem.start).toLocaleString()),
              React.createElement(M.Typography, { variant: 'body2', color: 'text.secondary' }, 'End: ', new Date(selectedItem.end).toLocaleString()),
              React.createElement(M.TextField, { label: 'Notes', multiline: true, minRows: 3, defaultValue: selectedItem.notes || '', fullWidth: true })
            )
          ),
          React.createElement(M.DialogActions, null,
            selectedItem?.status !== 'Authorized' && React.createElement(M.Button, { startIcon: React.createElement(MI.VerifiedUser), variant: 'contained', onClick: () => handleAuthorize(selectedItem.id) }, 'Authorize'),
            selectedItem?.status !== 'Canceled' && React.createElement(M.Button, { color: 'error', startIcon: React.createElement(MI.Cancel), onClick: () => handleCancel(selectedItem.id) }, 'Cancel Mission'),
            React.createElement(M.Button, { onClick: () => setSelectedItem(null) }, 'Close')
          )
        ),
        React.createElement(M.Snackbar, { open: snack.open, autoHideDuration: 2500, onClose: () => setSnack({ open: false, message: '' }), message: snack.message })
      )
    );
  }

  // Utilities
  function buildVisOptions(view, date) {
    const start = new Date(date);
    const end = new Date(date);
    if (view === 'day') {
      start.setHours(6, 0, 0, 0);
      end.setHours(22, 0, 0, 0);
    } else {
      // week
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // week start Monday
      start.setDate(diff);
      start.setHours(6, 0, 0, 0);
      end.setTime(start.getTime() + 6 * 24 * 60 * 60 * 1000);
      end.setHours(22, 0, 0, 0);
    }
    return {
      stack: false,
      editable: { add: false, remove: false, updateTime: true, updateGroup: true },
      margin: { item: 8 },
      orientation: 'top',
      zoomMin: 15 * 60 * 1000,
      zoomMax: 14 * 24 * 60 * 60 * 1000,
      start,
      end,
      multiselect: false,
      clickToUse: false,
      selectable: true,
      groupOrder: (a, b) => a.order - b.order,
      tooltip: { followMouse: true },
      moveable: true,
      timeAxis: { scale: 'hour', step: 1 },
      locale: 'en',
    };
  }

  function groupName(groups, id) {
    const g = groups.find((x) => x.id === id);
    return g ? g.content : String(id);
  }

  function labelForDate(date, view) {
    if (view === 'day') return new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(date);
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
    const fmt = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' });
    return `${fmt.format(start)} - ${fmt.format(end)}`;
  }

  function overlaps(a, b) {
    return a.group === b.group && a.id !== b.id && a.start < b.end && b.start < a.end;
  }

  function markConflicts(items) {
    return items.map((it) => ({
      ...it,
      conflict: items.some((other) => overlaps(it, other))
    }));
  }

  function applyConflictClasses(timeline, items) {
    const domItems = timeline.itemsData.getIds();
    domItems.forEach((id) => {
      const item = timeline.itemsData.get(id);
      const element = timeline.itemSet.items[id]?.dom?.box;
      if (!element) return;
      const runtime = items.find((it) => it.id === id);
      if (runtime?.conflict) element.classList.add('conflict');
      else element.classList.remove('conflict');
    });
  }

  // Demo data
  function demoGroups() {
    return [
      { id: 'AC-101', content: 'Aircraft 101', order: 1, type: 'aircraft' },
      { id: 'AC-202', content: 'Aircraft 202', order: 2, type: 'aircraft' },
      { id: 'SIM-A', content: 'Simulator A', order: 3, type: 'sim' },
      { id: 'SIM-B', content: 'Simulator B', order: 4, type: 'sim' },
    ];
  }

  function demoItems(baseDate) {
    const d = (h, m) => new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), h, m, 0, 0);
    const items = [
      { id: 'M1', group: 'AC-101', start: d(8, 0), end: d(10, 0), title: 'Instrument 1', status: 'Planned' },
      { id: 'M2', group: 'AC-101', start: d(10, 30), end: d(12, 0), title: 'Formation 1', status: 'Planned' },
      { id: 'M3', group: 'AC-202', start: d(9, 0), end: d(11, 30), title: 'Nav 2', status: 'Planned' },
      { id: 'M4', group: 'SIM-A', start: d(13, 0), end: d(14, 30), title: 'Sim Check', status: 'Authorized' },
      { id: 'M5', group: 'SIM-B', start: d(9, 30), end: d(11, 0), title: 'Basic Instruments', status: 'Planned' },
      { id: 'M6', group: 'AC-202', start: d(12, 0), end: d(13, 0), title: 'Pattern', status: 'Canceled' },
    ];
    return markConflicts(items);
  }

  // Render
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();


