$._VIDISPINE_ = {
  onError: function (error) {
    app.setSDKEventMessage(error.message, "error");
    throw error;
  },

  onSetEventMessage: function (message, level) {
    app.setSDKEventMessage(message, level);
  },

  getSep: function () {
    if (Folder.fs === "Macintosh") {
      return "/";
    } else {
      return "\\";
    }
  },

  parseProjectItem: function (projectItem, parseOpts, parentItem) {
    var parsedProjectItem = {
      projectItem: projectItem,
      name: projectItem.name,
      nodeId: projectItem.nodeId,
      type: projectItem.type,
      treePath: projectItem.treePath,
      mediaPath: projectItem.getMediaPath(),
      isSequence: projectItem.isSequence(),
      canProxy: projectItem.canProxy(),
      hasProxy: projectItem.hasProxy(),
      isOffline: projectItem.isOffline(),
      proxyPath: projectItem.getProxyPath(),
      children: [],
    };
    if (parentItem) {
      parsedProjectItem.parentItem = {
        name: parentItem.name,
        nodeId: parentItem.nodeId,
        treePath: parentItem.treePath,
        metadata: parentItem.metadata,
      };
    }
    if (parsedProjectItem.children) {
      parsedProjectItem.children = projectItem.children;
    }
    if (parseOpts && parseOpts.fields) {
      parsedProjectItem.metadata = $._VIDISPINE_.getProjectItemMetadata(
        projectItem,
        parseOpts.fields
      );
    }
    return parsedProjectItem;
  },

  getProjectItemMetadata: function (projectItem, fields) {
    var metadata = {};
    if (ExternalObject.AdobeXMPScript === undefined) {
      ExternalObject.AdobeXMPScript = new ExternalObject("lib:AdobeXMPScript");
    }
    var projectMetadata = projectItem.getProjectMetadata();
    var xmp = new XMPMeta(projectMetadata);
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      var value = xmp.getProperty(
        "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/",
        field
      );
      if (value) {
        metadata[field] = String(value);
      } else {
        metadata[field] = undefined;
      }
    }
    return metadata;
  },

  setProjectItemMetadata: function (projectItem, fields) {
    try {
      if (ExternalObject.AdobeXMPScript === undefined) {
        ExternalObject.AdobeXMPScript = new ExternalObject(
          "lib:AdobeXMPScript"
        );
      }
      var projectMetadata = projectItem.getProjectMetadata();
      var xmp = new XMPMeta(projectMetadata);
      var updatedFields = [];
      // eslint-disable-next-line no-restricted-syntax
      for (var field in fields) {
        if (Object.prototype.hasOwnProperty.call(fields, field)) {
          updatedFields.push(field);
          app.project.addPropertyToProjectMetadataSchema(field, field, 2);
          var value = fields[field];
          xmp.setProperty(
            "http://ns.adobe.com/premierePrivateProjectMetaData/1.0/",
            field,
            value
          );
        }
      }
      var newMetadata = xmp.serialize();
      projectItem.setProjectMetadata(newMetadata, updatedFields);
      return true;
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },

  walkBin: function (parentItem, parseOpts) {
    var output = [];
    for (var i = 0; i < parentItem.children.numItems; i++) {
      var currentChild = parentItem.children[i];
      if (currentChild) {
        var parsedCurrentChild = $._VIDISPINE_.parseProjectItem(
          currentChild,
          parseOpts,
          parentItem
        );
        output[i] = parsedCurrentChild;
        if (currentChild.type === ProjectItemType.BIN) {
          output[i].children = $._VIDISPINE_.walkBin(
            parsedCurrentChild,
            parseOpts
          );
        }
      }
    }
    return output;
  },

  walkProject: function (parseOpts) {
    try {
      var projectItem = app.project.rootItem;
      var output = $._VIDISPINE_.parseProjectItem(projectItem, parseOpts);
      output.children = $._VIDISPINE_.walkBin(projectItem, parseOpts);
      return output;
    } catch (error) {
      $._VIDISPINE_.onError(error);
      throw error;
    }
  },

  importFile: function (mediaPath, fields) {
    try {
      var targetBin = app.project.rootItem;
      app.project.importFiles([mediaPath], true, targetBin);
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(mediaPath)[0];
      if (fields) {
        $._VIDISPINE_.setProjectItemMetadata(projectItem, fields);
      }
      return $._VIDISPINE_.parseProjectItem(projectItem);
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },

  importProxy: function (mediaPath, fields, filename) {
    try {
      var targetBin = app.project.rootItem;
      app.project.importFiles([mediaPath], true, targetBin);
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(mediaPath)[0];
      projectItem.name = filename;
      if (fields) {
        $._VIDISPINE_.setProjectItemMetadata(projectItem, fields);
      }
      projectItem.attachProxy(mediaPath, 0);
      projectItem.setOffline();
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(mediaPath)[0];
      return $._VIDISPINE_.parseProjectItem(projectItem);
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },

  attachProxy: function (proxyPath, mediaPath) {
    try {
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(mediaPath)[0];
      projectItem.attachProxy(proxyPath, 0);
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(mediaPath)[0];
      return $._VIDISPINE_.parseProjectItem(projectItem);
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },

  attachOriginal: function (originalPath, mediaPath) {
    try {
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(mediaPath)[0];
      projectItem.attachProxy(originalPath, 1);
      projectItem.refreshMedia();
      var projectItem =
        app.project.rootItem.findItemsMatchingMediaPath(originalPath)[0];
      return $._VIDISPINE_.parseProjectItem(projectItem);
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },

  createLayer: function (layername) {
    try {
      if (layername == undefined) layername = "Layer";
      var originalLayer = app.activeDocument.activeLayer;
      var layerRef = app.activeDocument.artLayers.add();
      layerRef.name = layername;
      layerRef.blendMode = BlendMode.NORMAL;
      layerRef.moveAfter(originalLayer);
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },

  saveFile: function (placeFile) {
    try {
      $._VIDISPINE_.createLayer();
      var desc21 = new ActionDescriptor();
      desc21.putPath(charIDToTypeID("null"), new File(placeFile));
      desc21.putEnumerated(
        charIDToTypeID("FTcs"),
        charIDToTypeID("QCSt"),
        charIDToTypeID("Qcsa")
      );
      var desc22 = new ActionDescriptor();
      desc22.putUnitDouble(charIDToTypeID("Hrzn"), charIDToTypeID("#Pxl"), 0.0);
      desc22.putUnitDouble(charIDToTypeID("Vrtc"), charIDToTypeID("#Pxl"), 0.0);
      desc21.putObject(charIDToTypeID("Ofst"), charIDToTypeID("Ofst"), desc22);
      executeAction(charIDToTypeID("Plc "), desc21, DialogModes.NO);
    } catch (error) {
      $._VIDISPINE_.onError(error);
    }
  },
};
