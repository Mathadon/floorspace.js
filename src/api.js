window.api = {
  config: null,
  initAlreadyRun: false,
  openFloorplan: (data) => {
    try {
      window.application.$store.dispatch('importFloorplan', {
        clientWidth: document.getElementById('svg-grid').clientWidth,
        clientHeight: document.getElementById('svg-grid').clientHeight,
        data: JSON.parse(data),
      });
    } catch (err) {
      return false;
    }
    return true;
  },
  importLibrary: (data) => {
    try {
      window.application.$store.dispatch('importLibrary', { data: JSON.parse(data) });
    } catch (err) {
      return false;
    }
    return true;
  },
  exportFloorplan: () => window.application.$store.getters['exportData'],
  setConfig: (config) => {
    if (this.initAlreadyRun) {
      throw new Error('The application has already been started, configuration cannot be changed.');
    }

    if (config === undefined) {
      config = {}; // eslint-disable-line
    }
    window.api.config = Object.assign({
      showImportExport: true,
      units: 'm',
      showMapDialogOnStart: false,
      online: true,
      initialGridSize: 50,
      initialNorthAxis: 0,
      defaultLocation: {
        latitude: 39.7653,
        longitude: -104.9863,
      },
      onChange: () => { window.versionNumber += 1; },
    }, config);
  },
  init: () => {
    if (this.initAlreadyRun) {
      throw new Error('This method can only be run once!');
    }
    window.versionNumber = 0;
    window.startApp();
    delete window.startApp;

    // don't dispatch actions until the application and data store are instantiated
    window.application.$store.dispatch('project/setUnits', { units: window.api.config.units });
    window.application.$store.dispatch('project/setShowImportExport', window.api.config.showImportExport);
    window.application.$store.dispatch('project/setSpacing', { spacing: window.api.config.initialGridSize });
    window.application.$store.dispatch('project/setNorthAxis', { north_axis: window.api.config.initialNorthAxis });

    window.application.$store.dispatch('project/setMapEnabled', { enabled: window.api.config.showMapDialogOnStart });
    window.application.$store.dispatch('project/setMapVisible', { visible: window.api.config.showMapDialogOnStart });

    window.application.$store.dispatch('project/setMapLatitude', { latitude: window.api.config.defaultLocation.latitude });
    window.application.$store.dispatch('project/setMapLongitude', { longitude: window.api.config.defaultLocation.longitude });

    this.initAlreadyRun = true;
  },
};
