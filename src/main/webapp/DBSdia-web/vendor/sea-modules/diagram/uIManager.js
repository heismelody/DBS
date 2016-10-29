a.unbind("mousemove.operate").bind("mousemove.operate", function(g) {
  if (Designer.op.state != null) {
    return
  }
  Designer.op.destroy();
  var f = Utils.getRelativePos(g.pageX, g.pageY, b);
  var isPointInRect = Utils.getShapeByPosition(f.x, f.y);
  if (isPointInRect != null) {
    if (isPointInRect.type != "dataAttribute") {
      if (isPointInRect.type != "linker") {
        if (isPointInRect.type != "linker_point") {
          if (isPointInRect.type != "linker_text") {
            if (isPointInRect.type != "shape") {
              a.css("cursor", "crosshair");
              Designer.op.shapeSelectable(isPointInRect.shape);
              Designer.op.shapeLinkable(isPointInRect.shape, isPointInRect.linkPoint)
            }
            if (isPointInRect.shape.parent) {
              Utils.showAnchors(Model.getShapeById(isPointInRect.shape.parent))
            } else {
              Utils.showAnchors(isPointInRect.shape)
            }
          }
        }
      }
    }
  } else {
    a.css("cursor", "default");
    Designer.op.shapeMultiSelectable()
  }
})

getShapeByPosition: function(relativeX, relativeY, G) {
  var m = [];
  for (var U = Model.orderList.length - 1; U >= 0; U--) {
    var curId = Model.orderList[U].id;
    var curElement = $("#" + curId);
    var curDiagramObject = Model.getShapeById(curId);
    if (curDiagramObject.attribute && curDiagramObject.attribute.collapseBy) {
      continue
    }
    var curPos = curElement.position();
    var offsetX = relativeX - curPos.left;
    var offsetY = relativeY - curPos.top;
    var diagramProperties = {
      x: curPos.left,
      y: curPos.top,
      w: curElement.width(),
      h: curElement.height()
    };
    var curCanvas = curElement.find(".shape_canvas")[0];
    var ctx = curCanvas.getContext("2d");
    var isPointInRect = this.pointInRect(relativeX, relativeY, diagramProperties);
    if (curDiagramObject.name == "linker") {
      if (!isPointInRect) {
        continue
      }
      if (G) {
        continue
      }
      var N = 10;
      N = N.toScale();
      var D = {
        x: relativeX - N,
        y: relativeY - N,
        w: N * 2,
        h: N * 2
      };
      if (this.pointInRect(curDiagramObject.to.x.toScale(), curDiagramObject.to.y.toScale(), D)) {
        var t = {
          type: "linker_point",
          point: "end",
          shape: curDiagramObject
        };
        m.push(t);
        continue
      }
      else {
        if (this.pointInRect(curDiagramObject.from.x.toScale(), curDiagramObject.from.y.toScale(), D)) {
          var t = {
            type: "linker_point",
            point: "from",
            shape: curDiagramObject
          };
          m.push(t);
          continue
        } else {
          var v = curElement.find(".text_canvas");
          var A = v.position();
          var D = {
            x: A.left,
            y: A.top,
            w: v.width(),
            h: v.height()
          };
          if (this.pointInRect(offsetX, offsetY, D)) {
            var t = {
              type: "linker_text",
              shape: curDiagramObject
            };
            m.push(t);
            continue
          }
          N = 7;
          N = N.toScale();
          var B = this.pointInLinker({
            x: relativeX.restoreScale(),
            y: relativeY.restoreScale()
          }, curDiagramObject, N);
          if (B > -1) {
            var t = {
              type: "linker",
              shape: curDiagramObject,
              pointIndex: B
            };
            m.push(t);
            continue
          }
        }
      }
    } else {
      if (isPointInRect && curDiagramObject.locked && !G) {
        if (ctx.isPointInPath(offsetX, offsetY)) {
          var t = {
            type: "shape",
            shape: curDiagramObject
          };
          m.push(t)
        }
        continue
      }
      var N = 7;
      if (isPointInRect) {
        N = N.toScale();
        var D = {
          x: relativeX - N,
          y: relativeY - N,
          w: N * 2,
          h: N * 2
        };
        var I = {
          x: curDiagramObject.props.x + curDiagramObject.props.w / 2,
          y: curDiagramObject.props.y + curDiagramObject.props.h / 2
        };
        var q = curDiagramObject.getAnchors();
        var t = null;
        for (var h = 0; h < q.length; h++) {
          var f = q[h];
          f = this.getRotated(I, {
            x: curDiagramObject.props.x + f.x,
            y: curDiagramObject.props.y + f.y
          }, curDiagramObject.props.angle);
          if (Utils.pointInRect(f.x.toScale(), f.y.toScale(), D)) {
            var r = Utils.getPointAngle(curId, f.x, f.y, N);
            f.angle = r;
            t = {
              type: "bounding",
              shape: curDiagramObject,
              linkPoint: f
            };
            if (ctx.isPointInPath(offsetX, offsetY)) {
              t.inPath = true
            }
            break
          }
        }
        if (t != null) {
          m.push(t);
          continue
        }
      }
      if (curDiagramObject.dataAttributes) {
        var t = null;
        for (var l = 0; l < curDiagramObject.dataAttributes.length; l++) {
          var p = curDiagramObject.dataAttributes[l];
          if (p.type == "link" && p.showType && p.showType != "none") {
            var C = curElement.children("#attr_canvas_" + p.id);
            if (C.length > 0) {
              var w = C.position();
              var K = offsetX - w.left;
              var J = offsetY - w.top;
              var n = C[0].getContext("2d");
              if (n.isPointInPath(K, J)) {
                t = {
                  type: "dataAttribute",
                  shape: curDiagramObject,
                  attribute: p
                };
                break
              }
            }
          }
        }
        if (t != null) {
          m.push(t);
          continue
        }
      }
      if (!isPointInRect) {
        continue
      }
      if (ctx.isPointInPath(offsetX, offsetY)) {
        if (G) {
          var q = curDiagramObject.getAnchors();
          if (q && q.length) {
            var z = false;
            for (var T = U + 1; T < Model.orderList.length; T++) {
              var a = Model.orderList[T].id;
              var R = Model.getShapeById(a);
              if (Utils.rectInRect(R.props, curDiagramObject.props)) {
                z = true;
                continue
              }
            }
            if (z) {
              continue
            }
            var t = {
              type: "shape",
              shape: curDiagramObject
            };
            m.push(t);
            continue
          } else {
            continue
          }
        } else {
          var t = {
            type: "shape",
            shape: curDiagramObject
          };
          m.push(t);
          continue
        }
      } else {
        if (!curDiagramObject.attribute || typeof curDiagramObject.attribute.linkable == "undefined" || curDiagramObject.attribute.linkable) {
          var r = Utils.getPointAngle(curId, relativeX.restoreScale(), relativeY.restoreScale(), N);
          if (r != null) {
            var t = null;
            var b = {
              angle: r
            };
            for (var H = 1; H <= N; H++) {
              if (r == 0) {
                b.x = offsetX + H;
                b.y = offsetY
              } else {
                if (r < Math.PI / 2) {
                  b.x = offsetX + H * Math.cos(r);
                  b.y = offsetY + H * Math.sin(r)
                } else {
                  if (r == Math.PI / 2) {
                    b.x = offsetX;
                    b.y = offsetY + H
                  } else {
                    if (r < Math.PI) {
                      b.x = offsetX - H * Math.sin(r - Math.PI / 2);
                      b.y = offsetY + H * Math.cos(r - Math.PI / 2)
                    } else {
                      if (r == Math.PI) {
                        b.x = offsetX - H;
                        b.y = offsetY
                      } else {
                        if (r < Math.PI / 2 * 3) {
                          b.x = offsetX - H * Math.cos(r - Math.PI);
                          b.y = offsetY - H * Math.sin(r - Math.PI)
                        } else {
                          if (r == Math.PI / 2 * 3) {
                            b.x = offsetX;
                            b.y = offsetY - H
                          } else {
                            b.x = offsetX + H * Math.sin(r - Math.PI / 2 * 3);
                            b.y = offsetY - H * Math.cos(r - Math.PI / 2 * 3)
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (ctx.isPointInPath(b.x, b.y)) {
                b.x += curPos.left;
                b.y += curPos.top;
                b.x = b.x.restoreScale();
                b.y = b.y.restoreScale();
                t = {
                  type: "bounding",
                  shape: curDiagramObject,
                  linkPoint: b
                };
                break
              }
            }
            if (t != null) {
              m.push(t);
              continue
            }
          }
        }
      }
    }
  }
  var t = null;
  if (m.length == 1) {
    t = m[0]
  }
  if (m.length > 1 && G) {
    t = m[0]
  } else {
    if (m.length > 1) {
      var g = m[0];
      if (g.type == "bounding" && g.type != "linker_point" && g.type != "linker") {
        return g
      }
      var B = [];
      var d = [];
      var o = [];
      for (var U = 0; U < m.length; U++) {
        var O = m[U];
        if (O.type == "bounding") {
          o.push(O)
        } else {
          if (O.type == "linker") {
            B.push(O)
          } else {
            if (O.type == "linker_point") {
              d.push(O)
            }
          }
        }
      }
      if (o.length > 0 && d.length > 0) {
        for (var U = 0; U < o.length; U++) {
          var O = o[U];
          if (O.inPath) {
            t = O;
            break
          }
        }
      }
      if (t == null && d.length > 0) {
        d.sort(function e(j, i) {
          if (Utils.isSelected(j.shape.id) && !Utils.isSelected(i.shape.id)) {
            return -1
          } else {
            if (!Utils.isSelected(j.shape.id) && Utils.isSelected(i.shape.id)) {
              return 1
            } else {
              return i.shape.props.zindex - j.shape.props.zindex
            }
          }
        });
        t = d[0]
      }
      if (t == null && B.length > 0) {
        B.sort(function e(j, i) {
          if (Utils.isSelected(j.shape.id) && !Utils.isSelected(i.shape.id)) {
            return -1
          } else {
            if (!Utils.isSelected(j.shape.id) && Utils.isSelected(i.shape.id)) {
              return 1
            } else {
              return i.shape.props.zindex - j.shape.props.zindex
            }
          }
        });
        t = B[0]
      }
      if (t == null) {
        t = m[0]
      }
    }
  }
  return t
},
