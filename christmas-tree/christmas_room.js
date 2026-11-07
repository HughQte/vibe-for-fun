<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interactive Christmas Room</title>
  <style>
    html, body {
      margin: 0;
      overflow: hidden;
      height: 100%;
      background: #0d1117;
      font-family: Arial, sans-serif;
      touch-action: none;
    }

    canvas {
      display: block;
    }

    #ui {
      position: fixed;
      top: 14px;
      left: 14px;
      z-index: 20;
      color: #fff7df;
      background: rgba(20, 20, 28, 0.65);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 14px;
      padding: 12px 14px;
      max-width: 320px;
      backdrop-filter: blur(8px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      line-height: 1.45;
      font-size: 14px;
    }

    #ui b {
      color: #ffd777;
    }

    #ornamentLabel {
      position: fixed;
      z-index: 25;
      pointer-events: none;
      transform: translate(-50%, -130%);
      color: #fffdf5;
      background: rgba(28, 28, 36, 0.90);
      padding: 8px 12px;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 8px 18px rgba(0,0,0,0.25);
      font-size: 13px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.22s ease;
    }

    #ornamentLabel.show {
      opacity: 1;
    }

    #santaNotice {
      position: fixed;
      top: 14px;
      right: 14px;
      z-index: 20;
      color: #fff7df;
      background: rgba(120, 20, 20, 0.70);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 14px;
      padding: 10px 12px;
      backdrop-filter: blur(6px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.25);
      font-size: 13px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    #santaNotice.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div id="ui">
    <div><b>Interactive Christmas Room</b></div>
    <div>• Drag to rotate</div>
    <div>• Scroll / pinch to zoom</div>
    <div>• Click ornaments to interact</div>
    <div>• Santa appears every <b>1 minute</b></div>
  </div>

  <div id="ornamentLabel"></div>
  <div id="santaNotice">🎅 Santa is sneaking in...</div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.1/examples/jsm/"
    }
  }
  </script>

  <script type="module">
    import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";

    // ---------------------------
    // BASIC SETUP
    // ---------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101722);
    scene.fog = new THREE.Fog(0x101722, 16, 34);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(7.2, 5.8, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4.5;
    controls.maxDistance = 14;
    controls.target.set(0, 2.2, 0);
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = Math.PI * 0.18;

    // ---------------------------
    // LIGHTING
    // ---------------------------
    const ambient = new THREE.AmbientLight(0xfff3dd, 1.1);
    scene.add(ambient);

    const roomLight = new THREE.PointLight(0xffe7c1, 1.1, 28, 2);
    roomLight.position.set(0, 6.8, 0);
    roomLight.castShadow = true;
    scene.add(roomLight);

    const treeLight = new THREE.PointLight(0xbbe7ff, 0.55, 10, 2);
    treeLight.position.set(0, 4, 0);
    scene.add(treeLight);

    const fireLight = new THREE.PointLight(0xff8d33, 3.0, 14, 2);
    fireLight.position.set(-5.3, 1.7, -3.2);
    fireLight.castShadow = true;
    scene.add(fireLight);

    // ---------------------------
    // HELPERS
    // ---------------------------
    function makeMaterial(color, roughness = 0.7, metalness = 0.0) {
      return new THREE.MeshStandardMaterial({ color, roughness, metalness });
    }

    function roundedBox(w, h, d, color) {
      return new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        makeMaterial(color, 0.75, 0.0)
      );
    }

    function addShadow(mesh, cast = true, receive = true) {
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      return mesh;
    }

    // ---------------------------
    // ROOM
    // ---------------------------
    const room = new THREE.Group();
    scene.add(room);

    const floor = addShadow(new THREE.Mesh(
      new THREE.PlaneGeometry(18, 18),
      new THREE.MeshStandardMaterial({
        color: 0x5f4631,
        roughness: 0.95
      })
    ), false, true);
    floor.rotation.x = -Math.PI / 2;
    room.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xc9b8a3,
      roughness: 0.95
    });

    const backWall = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(18, 10), wallMaterial), false, true);
    backWall.position.set(0, 5, -9);
    room.add(backWall);

    const leftWall = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(18, 10), wallMaterial), false, true);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-9, 5, 0);
    room.add(leftWall);

    const rightWall = addShadow(new THREE.Mesh(new THREE.PlaneGeometry(18, 10), wallMaterial), false, true);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(9, 5, 0);
    room.add(rightWall);

    // Rug
    const rug = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.7, 0.08, 48),
      new THREE.MeshStandardMaterial({ color: 0x922d2d, roughness: 0.95 })
    ), false, true);
    rug.position.set(0, 0.04, 1.4);
    room.add(rug);

    // ---------------------------
    // FIREPLACE
    // ---------------------------
    const fireplace = new THREE.Group();
    fireplace.position.set(-5.2, 0, -3.2);
    room.add(fireplace);

    const hearth = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 2.8, 1.25),
      new THREE.MeshStandardMaterial({
        color: 0xd9d4cf,
        roughness: 0.95
      })
    ));
    hearth.position.y = 1.4;
    fireplace.add(hearth);

    const fireOpening = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.45, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x1d1a19, roughness: 1 })
    ), false, true);
    fireOpening.position.set(0, 1.15, 0.32);
    fireplace.add(fireOpening);

    const mantel = addShadow(new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.18, 1.55),
      makeMaterial(0xefebe7, 0.8)
    ));
    mantel.position.set(0, 2.78, 0);
    fireplace.add(mantel);

    const fireGroup = new THREE.Group();
    fireGroup.position.set(0, 0.63, 0.62);
    fireplace.add(fireGroup);

    const log1 = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.85, 12),
      makeMaterial(0x5a341f, 1.0)
    ));
    log1.rotation.z = Math.PI / 2.8;
    log1.rotation.x = 0.3;
    log1.position.set(-0.18, 0.08, 0);
    fireGroup.add(log1);

    const log2 = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.14, 0.95, 12),
      makeMaterial(0x6a3d26, 1.0)
    ));
    log2.rotation.z = -Math.PI / 2.8;
    log2.rotation.x = -0.2;
    log2.position.set(0.18, 0.08, 0);
    fireGroup.add(log2);

    const flameMat1 = new THREE.MeshBasicMaterial({ color: 0xffa833, transparent: true, opacity: 0.88 });
    const flameMat2 = new THREE.MeshBasicMaterial({ color: 0xff5f1f, transparent: true, opacity: 0.76 });
    const flame1 = new THREE.Mesh(new THREE.SphereGeometry(0.28, 18, 18), flameMat1);
    const flame2 = new THREE.Mesh(new THREE.SphereGeometry(0.20, 18, 18), flameMat2);
    flame1.scale.set(1.0, 1.65, 1.0);
    flame2.scale.set(1.0, 1.6, 1.0);
    flame1.position.set(-0.1, 0.48, 0);
    flame2.position.set(0.18, 0.34, 0.08);
    fireGroup.add(flame1, flame2);

    // Stockings
    function createStocking(color, x) {
      const stocking = new THREE.Group();
      const sockTop = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.12, 0.12), makeMaterial(0xffffff, 0.8)));
      const sockBody = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.12), makeMaterial(color, 0.7)));
      const foot = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.12), makeMaterial(color, 0.7)));
      sockBody.position.y = -0.2;
      foot.position.set(0.08, -0.38, 0);
      stocking.add(sockTop, sockBody, foot);
      stocking.position.set(x, 2.55, 0.65);
      fireplace.add(stocking);
    }
    createStocking(0xc42032, -0.65);
    createStocking(0x1d7a44, 0.0);
    createStocking(0xc42032, 0.65);

    // ---------------------------
    // CHAIR
    // ---------------------------
    const chair = new THREE.Group();
    chair.position.set(4.9, 0, -3.1);
    chair.rotation.y = -0.55;
    room.add(chair);

    const chairBase = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.55, 1.8), makeMaterial(0x95775a, 0.95)));
    chairBase.position.y = 0.55;
    chair.add(chairBase);

    const chairBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.55, 0.36), makeMaterial(0x8a6a4a, 0.95)));
    chairBack.position.set(0, 1.5, -0.72);
    chair.add(chairBack);

    const armL = addShadow(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.9, 1.55), makeMaterial(0x8a6a4a, 0.95)));
    const armR = armL.clone();
    armL.position.set(-0.82, 1.0, 0);
    armR.position.set(0.82, 1.0, 0);
    chair.add(armL, armR);

    const cushionSeat = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.28, 1.4), makeMaterial(0xcc4a4a, 0.9)));
    cushionSeat.position.y = 0.85;
    chair.add(cushionSeat);

    const cushionBack = addShadow(new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.65, 0.20), makeMaterial(0xe6d2aa, 0.8)));
    cushionBack.position.set(0, 1.45, -0.48);
    chair.add(cushionBack);

    // ---------------------------
    // TABLE WITH COOKIES & MILK
    // ---------------------------
    const table = new THREE.Group();
    table.position.set(3.1, 0, -0.2);
    room.add(table);

    const tableTop = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.74, 0.12, 24), makeMaterial(0x6e4a2c, 0.85)));
    tableTop.position.y = 1.05;
    table.add(tableTop);

    for (let i = 0; i < 4; i++) {
      const leg = addShadow(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.0, 10), makeMaterial(0x5f3d24, 0.85)));
      leg.position.set(Math.cos(i * Math.PI / 2 + Math.PI / 4) * 0.45, 0.5, Math.sin(i * Math.PI / 2 + Math.PI / 4) * 0.45);
      table.add(leg);
    }

    const plate = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.34, 0.04, 24),
      makeMaterial(0xf1eee8, 0.75)
    ));
    plate.position.set(-0.18, 1.13, 0.05);
    table.add(plate);

    function createCookie(x, z) {
      const c = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.11, 0.03, 20),
        makeMaterial(0xc58a4b, 0.95)
      ));
      c.position.set(x, 1.16, z);
      table.add(c);

      for (let i = 0; i < 5; i++) {
        const chip = new THREE.Mesh(new THREE.SphereGeometry(0.013, 8, 8), makeMaterial(0x59311e, 1));
        chip.position.set(
          x + (Math.random() - 0.5) * 0.11,
          1.177,
          z + (Math.random() - 0.5) * 0.11
        );
        table.add(chip);
      }
    }
    createCookie(-0.23, 0.03);
    createCookie(-0.10, -0.06);
    createCookie(-0.03, 0.10);

    const milkGlass = new THREE.Group();
    table.add(milkGlass);

    const glass = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.12, 0.34, 20, 1, true),
      new THREE.MeshStandardMaterial({
        color: 0xdfefff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.15,
        metalness: 0.0
      })
    ), true, true);
    glass.position.set(0.22, 1.24, -0.03);
    milkGlass.add(glass);

    const milk = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.095, 0.095, 0.22, 20),
      makeMaterial(0xfaf9f5, 0.6)
    ), false, true);
    milk.position.set(0.22, 1.18, -0.03);
    milkGlass.add(milk);

    // ---------------------------
    // CHRISTMAS TREE
    // ---------------------------
    const tree = new THREE.Group();
    tree.position.set(0, 0, 0);
    room.add(tree);

    const trunk = addShadow(new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.32, 1.2, 16),
      makeMaterial(0x6d4025, 1)
    ));
    trunk.position.y = 0.6;
    tree.add(trunk);

    const treeLayers = [
      { r: 2.15, h: 2.25, y: 1.5 },
      { r: 1.75, h: 2.0, y: 2.35 },
      { r: 1.32, h: 1.7, y: 3.1 },
      { r: 0.92, h: 1.35, y: 3.75 }
    ];

    for (const layer of treeLayers) {
      const cone = addShadow(new THREE.Mesh(
        new THREE.ConeGeometry(layer.r, layer.h, 24),
        new THREE.MeshStandardMaterial({
          color: 0x165e38,
          roughness: 0.85,
          metalness: 0.05
        })
      ));
      cone.position.y = layer.y;
      tree.add(cone);
    }

    // Tree topper star
    const starGroup = new THREE.Group();
    const starGeo = new THREE.OctahedronGeometry(0.28, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffd84a,
      emissive: 0xffbe33,
      emissiveIntensity: 1.3,
      roughness: 0.3,
      metalness: 0.3
    });
    const star = addShadow(new THREE.Mesh(starGeo, starMat));
    star.position.y = 4.85;
    star.scale.y = 0.75;
    starGroup.add(star);
    const starGlow = new THREE.PointLight(0xffc85a, 1.8, 6, 2);
    starGlow.position.y = 4.85;
    starGroup.add(starGlow);
    tree.add(starGroup);

    // ---------------------------
    // ORNAMENTS
    // ---------------------------
    const interactiveObjects = [];
    const ornaments = [];
    const presentArea = new THREE.Group();
    tree.add(presentArea);

    const label = document.getElementById("ornamentLabel");

    const ornamentMessages = [
      "🎄 Merry Christmas!",
      "⭐ Twinkle, twinkle!",
      "🎁 A tiny holiday surprise!",
      "🍬 Sweet Christmas cheer!",
      "❄️ Winter magic!",
      "🧦 Cozy festive vibes!",
      "🫶 Warm wishes for you!",
      "🔔 Jingle all the way!"
    ];

    function createBauble(color, pos, size = 0.13, name = "Bauble") {
      const mesh = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(size, 20, 20),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.35,
          metalness: 0.55,
          emissive: color,
          emissiveIntensity: 0.08
        })
      ));
      mesh.position.copy(pos);

      const cap = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(size * 0.22, size * 0.22, size * 0.18, 10),
        makeMaterial(0xd7c17b, 0.4, 0.7)
      ));
      cap.position.set(0, size * 1.02, 0);
      mesh.add(cap);

      mesh.userData = {
        type: "ornament",
        name,
        message: ornamentMessages[Math.floor(Math.random() * ornamentMessages.length)],
        pulse: 0,
        baseScale: new THREE.Vector3(1,1,1)
      };

      tree.add(mesh);
      ornaments.push(mesh);
      interactiveObjects.push(mesh);
    }

    function createGiftOrnament(colorA, colorB, pos, size = 0.22) {
      const group = new THREE.Group();

      const box = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        makeMaterial(colorA, 0.6)
      ));
      group.add(box);

      const ribbon1 = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(size * 0.18, size * 1.02, size * 1.02),
        makeMaterial(colorB, 0.45)
      ));
      const ribbon2 = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(size * 1.02, size * 1.02, size * 0.18),
        makeMaterial(colorB, 0.45)
      ));
      group.add(ribbon1, ribbon2);

      const bow1 = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(size * 0.14, size * 0.04, 10, 16),
        makeMaterial(colorB, 0.35, 0.1)
      ));
      bow1.rotation.x = Math.PI / 2;
      bow1.position.y = size * 0.55;
      const bow2 = bow1.clone();
      bow2.rotation.z = Math.PI / 2;
      group.add(bow1, bow2);

      group.position.copy(pos);
      group.userData = {
        type: "ornament",
        name: "Gift Ornament",
        message: "🎁 Tiny gift on the tree!",
        pulse: 0,
        baseScale: new THREE.Vector3(1,1,1)
      };

      tree.add(group);
      ornaments.push(group);
      interactiveObjects.push(group);
    }

    function createCandyCane(pos, scale = 1) {
      const group = new THREE.Group();

      const stem = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 0.34 * scale, 12),
        makeMaterial(0xffffff, 0.55)
      ));
      group.add(stem);

      const hook = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(0.085 * scale, 0.04 * scale, 10, 22, Math.PI),
        makeMaterial(0xffffff, 0.55)
      ));
      hook.rotation.z = -Math.PI / 2;
      hook.position.set(0.08 * scale, 0.15 * scale, 0);
      group.add(hook);

      const stripeMat = makeMaterial(0xd62f45, 0.45);
      for (let i = 0; i < 4; i++) {
        const band = addShadow(new THREE.Mesh(
          new THREE.BoxGeometry(0.08 * scale, 0.03 * scale, 0.09 * scale),
          stripeMat
        ));
        band.rotation.z = Math.PI / 5;
        band.position.set(0, -0.13 * scale + i * 0.09 * scale, 0);
        group.add(band);
      }

      group.position.copy(pos);
      group.userData = {
        type: "ornament",
        name: "Candy Cane",
        message: "🍬 Sweet and festive!",
        pulse: 0,
        baseScale: new THREE.Vector3(1,1,1)
      };

      tree.add(group);
      ornaments.push(group);
      interactiveObjects.push(group);
    }

    function createSnowmanOrnament(pos, scale = 1) {
      const group = new THREE.Group();

      const b1 = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.11 * scale, 18, 18),
        makeMaterial(0xf7f7f7, 0.65)
      ));
      const b2 = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.08 * scale, 18, 18),
        makeMaterial(0xf7f7f7, 0.65)
      ));
      b2.position.y = 0.14 * scale;
      group.add(b1, b2);

      const nose = addShadow(new THREE.Mesh(
        new THREE.ConeGeometry(0.018 * scale, 0.08 * scale, 10),
        makeMaterial(0xf28c28, 0.8)
      ));
      nose.rotation.z = -Math.PI / 2;
      nose.position.set(0.065 * scale, 0.15 * scale, 0);
      group.add(nose);

      const eyeMat = makeMaterial(0x222222, 1);
      const e1 = new THREE.Mesh(new THREE.SphereGeometry(0.008 * scale, 8, 8), eyeMat);
      const e2 = e1.clone();
      e1.position.set(-0.018 * scale, 0.165 * scale, 0.07 * scale);
      e2.position.set(0.018 * scale, 0.165 * scale, 0.07 * scale);
      group.add(e1, e2);

      group.position.copy(pos);
      group.userData = {
        type: "ornament",
        name: "Snowman Ornament",
        message: "⛄ A tiny snow friend!",
        pulse: 0,
        baseScale: new THREE.Vector3(1,1,1)
      };

      tree.add(group);
      ornaments.push(group);
      interactiveObjects.push(group);
    }

    // Ornament placement
    const ornamentPositions = [
      new THREE.Vector3( 0.95, 1.25,  0.35),
      new THREE.Vector3(-1.05, 1.35,  0.10),
      new THREE.Vector3( 0.55, 1.55, -0.92),
      new THREE.Vector3(-0.55, 1.85, -1.05),
      new THREE.Vector3( 1.10, 2.10, -0.18),
      new THREE.Vector3(-1.00, 2.20,  0.52),
      new THREE.Vector3( 0.42, 2.45,  0.95),
      new THREE.Vector3(-0.25, 2.70, -0.72),
      new THREE.Vector3( 0.82, 2.95,  0.18),
      new THREE.Vector3(-0.72, 3.10,  0.06),
      new THREE.Vector3( 0.18, 3.35, -0.55),
      new THREE.Vector3(-0.18, 3.55,  0.38)
    ];

    createBauble(0xd62f45, ornamentPositions[0], 0.16, "Red Bauble");
    createBauble(0x3ea6ff, ornamentPositions[1], 0.15, "Blue Bauble");
    createBauble(0xffc73c, ornamentPositions[2], 0.14, "Golden Bauble");
    createBauble(0xe364ff, ornamentPositions[3], 0.14, "Pink Bauble");
    createBauble(0x4bd17d, ornamentPositions[4], 0.13, "Green Bauble");
    createBauble(0xffffff, ornamentPositions[5], 0.12, "Snow Pearl");
    createGiftOrnament(0x8c62ff, 0xf3d34a, ornamentPositions[6], 0.24);
    createGiftOrnament(0x25c8c8, 0xffffff, ornamentPositions[7], 0.21);
    createCandyCane(ornamentPositions[8], 1.0);
    createCandyCane(ornamentPositions[9], 0.95);
    createSnowmanOrnament(ornamentPositions[10], 1.1);
    createSnowmanOrnament(ornamentPositions[11], 1.0);

    // Tree fairy lights
    const fairyLights = [];
    const fairyColors = [0xff4b4b, 0xffdb4d, 0x5cd6ff, 0xff8df7, 0x90ff90];

    for (let i = 0; i < 55; i++) {
      const t = i / 55;
      const angle = i * 0.9;
      const radius = 1.6 * (1 - t * 0.75);
      const y = 1.0 + t * 3.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const color = fairyColors[i % fairyColors.length];
      const lightBall = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 10, 10),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 1.5,
          roughness: 0.35,
          metalness: 0.1
        })
      );
      lightBall.position.set(x, y, z);
      tree.add(lightBall);
      fairyLights.push(lightBall);
    }

    // ---------------------------
    // PRESENTS UNDER TREE
    // ---------------------------
    const giftColors = [
      [0xd62f45, 0xf5deb3],
      [0x2a9d8f, 0xfff0a8],
      [0x7b61ff, 0xf9dc5c],
      [0xf28c28, 0xffffff]
    ];

    function createFloorPresent(position, size = 0.55, colors = giftColors[0]) {
      const group = new THREE.Group();

      const box = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        makeMaterial(colors[0], 0.65)
      ));
      group.add(box);

      const ribbon1 = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(size * 0.16, size * 1.04, size * 1.04),
        makeMaterial(colors[1], 0.45)
      ));
      const ribbon2 = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(size * 1.04, size * 1.04, size * 0.16),
        makeMaterial(colors[1], 0.45)
      ));
      group.add(ribbon1, ribbon2);

      const bow1 = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(size * 0.16, size * 0.04, 10, 16),
        makeMaterial(colors[1], 0.4, 0.1)
      ));
      bow1.rotation.x = Math.PI / 2;
      bow1.position.y = size * 0.56;
      const bow2 = bow1.clone();
      bow2.rotation.z = Math.PI / 2;
      group.add(bow1, bow2);

      group.position.copy(position);
      group.position.y = size / 2;
      presentArea.add(group);
      return group;
    }

    createFloorPresent(new THREE.Vector3(-0.85, 0, 0.55), 0.55, giftColors[0]);
    createFloorPresent(new THREE.Vector3( 0.68, 0, 0.35), 0.48, giftColors[1]);
    createFloorPresent(new THREE.Vector3( 0.10, 0, -0.70), 0.52, giftColors[2]);

    // ---------------------------
    // SANTA
    // ---------------------------
    const santaRoot = new THREE.Group();
    scene.add(santaRoot);

    const santa = new THREE.Group();
    santaRoot.add(santa);

    function createSanta() {
      const group = new THREE.Group();

      // body
      const body = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.42, 18, 18),
        makeMaterial(0xc3202b, 0.7)
      ));
      body.scale.set(1.1, 1.2, 1.0);
      body.position.y = 1.0;
      group.add(body);

      // head
      const head = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 18, 18),
        makeMaterial(0xf4c9a3, 0.8)
      ));
      head.position.set(0, 1.58, 0);
      group.add(head);

      // beard
      const beard = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.19, 16, 16),
        makeMaterial(0xffffff, 0.9)
      ));
      beard.scale.set(1.0, 1.1, 0.8);
      beard.position.set(0, 1.43, 0.10);
      group.add(beard);

      // hat
      const hat = addShadow(new THREE.Mesh(
        new THREE.ConeGeometry(0.20, 0.42, 18),
        makeMaterial(0xc3202b, 0.6)
      ));
      hat.position.set(0, 1.87, 0);
      hat.rotation.z = -0.3;
      group.add(hat);

      const hatTrim = addShadow(new THREE.Mesh(
        new THREE.TorusGeometry(0.15, 0.035, 8, 16),
        makeMaterial(0xffffff, 0.8)
      ));
      hatTrim.rotation.x = Math.PI / 2;
      hatTrim.position.set(0, 1.72, 0);
      group.add(hatTrim);

      const pom = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        makeMaterial(0xffffff, 0.8)
      ));
      pom.position.set(-0.10, 2.0, 0);
      group.add(pom);

      // belt
      const belt = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.75, 0.12, 0.32),
        makeMaterial(0x1f1f1f, 0.7)
      ));
      belt.position.set(0, 0.95, 0.20);
      group.add(belt);

      const buckle = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.12, 0.06),
        makeMaterial(0xf4d35e, 0.3, 0.6)
      ));
      buckle.position.set(0, 0.95, 0.37);
      group.add(buckle);

      // legs
      for (let s of [-0.14, 0.14]) {
        const leg = addShadow(new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.07, 0.55, 12),
          makeMaterial(0x1e1e1e, 0.8)
        ));
        leg.position.set(s, 0.36, 0);
        group.add(leg);

        const boot = addShadow(new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.12, 0.22),
          makeMaterial(0x111111, 0.9)
        ));
        boot.position.set(s, 0.08, 0.06);
        group.add(boot);
      }

      // arms
      const leftArm = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.52, 12),
        makeMaterial(0xc3202b, 0.7)
      ));
      leftArm.position.set(-0.40, 1.07, 0);
      leftArm.rotation.z = 0.55;
      group.add(leftArm);

      const rightArm = addShadow(new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.52, 12),
        makeMaterial(0xc3202b, 0.7)
      ));
      rightArm.position.set(0.37, 1.05, 0);
      rightArm.rotation.z = -0.5;
      group.add(rightArm);

      // hand-held present
      const handPresent = new THREE.Group();
      const pBox = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.24, 0.24),
        makeMaterial(0x25c8c8, 0.55)
      ));
      const pRibbon1 = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.245, 0.245),
        makeMaterial(0xffffff, 0.4)
      ));
      const pRibbon2 = addShadow(new THREE.Mesh(
        new THREE.BoxGeometry(0.245, 0.245, 0.045),
        makeMaterial(0xffffff, 0.4)
      ));
      handPresent.add(pBox, pRibbon1, pRibbon2);
      handPresent.position.set(0.58, 0.9, 0.18);
      group.add(handPresent);

      // sack
      const sack = addShadow(new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 18, 18),
        makeMaterial(0x8b6b3f, 0.95)
      ));
      sack.scale.set(1.0, 1.2, 0.9);
      sack.position.set(-0.35, 1.0, -0.24);
      group.add(sack);

      // simple face
      const eyeMat = makeMaterial(0x1f1f1f, 1);
      const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8, 8), eyeMat);
      const eye2 = eye1.clone();
      eye1.position.set(-0.06, 1.62, 0.20);
      eye2.position.set(0.06, 1.62, 0.20);
      group.add(eye1, eye2);

      return group;
    }

    santa.add(createSanta());
    santa.scale.set(0.92, 0.92, 0.92);

    // Santa state
    const santaNotice = document.getElementById("santaNotice");
    const santaCycleMs = 60000;
    const santaEventDuration = 18000; // enter / place / exit
    let santaGiftCounter = 0;
    let cycleIndex = -1;

    function spawnSantaGift() {
      const positions = [
        new THREE.Vector3(-0.25, 0, 0.88),
        new THREE.Vector3(0.95, 0, -0.12),
        new THREE.Vector3(-1.05, 0, -0.28),
        new THREE.Vector3(0.25, 0, 1.0),
        new THREE.Vector3(1.1, 0, 0.58)
      ];
      const p = positions[santaGiftCounter % positions.length].clone();
      const colors = giftColors[santaGiftCounter % giftColors.length];
      const size = 0.42 + (santaGiftCounter % 3) * 0.05;
      createFloorPresent(p, size, colors);
      santaGiftCounter++;
    }

    let lastGiftSpawnedCycle = -1;

    function updateSanta(elapsedMs) {
      const currentCycle = Math.floor(elapsedMs / santaCycleMs);
      const timeInCycle = elapsedMs % santaCycleMs;

      if (currentCycle !== cycleIndex) {
        cycleIndex = currentCycle;
        santaNotice.classList.remove("show");
      }

      if (timeInCycle < santaEventDuration) {
        santa.visible = true;
        santaNotice.classList.add("show");

        const t = timeInCycle / santaEventDuration;

        // Path
        // start off right side -> near tree -> pause -> leave toward left
        let x, z, yRot;
        const walkYBob = Math.sin(elapsedMs * 0.01) * 0.03;

        if (t < 0.42) {
          // Enter
          const p = t / 0.42;
          x = THREE.MathUtils.lerp(8.5, 2.0, p);
          z = THREE.MathUtils.lerp(4.0, 1.7, p);
          yRot = THREE.MathUtils.lerp(-1.95, -2.25, p);
        } else if (t < 0.64) {
          // Place gift pause
          const p = (t - 0.42) / 0.22;
          x = THREE.MathUtils.lerp(2.0, 1.55, p);
          z = THREE.MathUtils.lerp(1.7, 1.0, p);
          yRot = -2.4;
        } else {
          // Exit
          const p = (t - 0.64) / 0.36;
          x = THREE.MathUtils.lerp(1.55, -8.5, p);
          z = THREE.MathUtils.lerp(1.0, 3.2, p);
          yRot = THREE.MathUtils.lerp(-2.5, -1.15, p);
        }

        santa.position.set(x, walkYBob, z);
        santa.rotation.y = yRot;

        // Slight bend when placing gift
        santa.rotation.z = (t > 0.48 && t < 0.60) ? -0.16 : 0;

        // Spawn gift once per cycle
        if (t > 0.56 && lastGiftSpawnedCycle !== currentCycle) {
          spawnSantaGift();
          lastGiftSpawnedCycle = currentCycle;
        }
      } else {
        santa.visible = false;
        santaNotice.classList.remove("show");
      }
    }

    santa.visible = false;

    // ---------------------------
    // PARTICLES / SNOW INSIDE ROOM FEEL
    // ---------------------------
    const sparkleGroup = new THREE.Group();
    scene.add(sparkleGroup);

    const sparkleCount = 65;
    const sparkleMeshes = [];
    const sparkleGeo = new THREE.SphereGeometry(0.03, 8, 8);

    for (let i = 0; i < sparkleCount; i++) {
      const m = new THREE.Mesh(
        sparkleGeo,
        new THREE.MeshBasicMaterial({
          color: i % 2 ? 0xffffff : 0xfff3b0,
          transparent: true,
          opacity: 0.55
        })
      );
      m.position.set(
        (Math.random() - 0.5) * 12,
        1 + Math.random() * 6.5,
        (Math.random() - 0.5) * 12
      );
      m.userData.offset = Math.random() * Math.PI * 2;
      sparkleGroup.add(m);
      sparkleMeshes.push(m);
    }

    // ---------------------------
    // INTERACTION / RAYCAST
    // ---------------------------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let currentLabelTarget = null;

    function showLabel(text, x, y) {
      label.textContent = text;
      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
      label.classList.add("show");
    }

    function hideLabel() {
      label.classList.remove("show");
      currentLabelTarget = null;
    }

    function pulseObject(obj) {
      obj.userData.pulse = 1.0;
    }

    function findInteractiveParent(obj) {
      let p = obj;
      while (p) {
        if (p.userData && p.userData.type === "ornament") return p;
        p = p.parent;
      }
      return null;
    }

    function handlePointer(clientX, clientY, click = false) {
      pointer.x = (clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(interactiveObjects, true);

      if (hits.length > 0) {
        const target = findInteractiveParent(hits[0].object);
        if (target) {
          const screen = target.position.clone();
          target.getWorldPosition(screen);
          screen.project(camera);

          const sx = (screen.x * 0.5 + 0.5) * window.innerWidth;
          const sy = (-screen.y * 0.5 + 0.5) * window.innerHeight;

          showLabel(`${target.userData.name} — ${target.userData.message}`, sx, sy);
          currentLabelTarget = target;

          if (click) pulseObject(target);
          return;
        }
      }

      if (click) hideLabel();
    }

    renderer.domElement.addEventListener("pointermove", (e) => {
      handlePointer(e.clientX, e.clientY, false);
    });

    renderer.domElement.addEventListener("pointerdown", (e) => {
      handlePointer(e.clientX, e.clientY, true);
    });

    // ---------------------------
    // CLOCK / ANIMATION
    // ---------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const elapsedMs = elapsed * 1000;

      controls.update();

      // Fireplace flicker
      fireLight.intensity = 2.5 + Math.sin(elapsed * 12) * 0.35 + Math.sin(elapsed * 21) * 0.2;
      flame1.scale.y = 1.4 + Math.sin(elapsed * 10) * 0.20;
      flame2.scale.y = 1.2 + Math.sin(elapsed * 13 + 1.2) * 0.18;
      flame1.position.y = 0.45 + Math.sin(elapsed * 9) * 0.04;
      flame2.position.y = 0.32 + Math.sin(elapsed * 11 + 0.7) * 0.03;

      // Star spin
      star.rotation.y += 0.015;
      star.rotation.x = Math.sin(elapsed * 2.0) * 0.16;
      star.material.emissiveIntensity = 1.15 + Math.sin(elapsed * 3) * 0.25;

      // Fairy lights twinkle
      for (let i = 0; i < fairyLights.length; i++) {
        const l = fairyLights[i];
        l.material.emissiveIntensity = 1.0 + Math.sin(elapsed * 4 + i) * 0.55;
      }

      // Ornament pulse / idle motion
      ornaments.forEach((obj, i) => {
        if (obj.userData.pulse > 0) {
          obj.userData.pulse -= 0.04;
          const boost = 1 + Math.sin((1 - obj.userData.pulse) * Math.PI * 6) * 0.18 * obj.userData.pulse;
          obj.scale.setScalar(boost);
          obj.rotation.y += 0.08;
        } else {
          obj.scale.lerp(obj.userData.baseScale, 0.18);
          obj.rotation.y += 0.002 + i * 0.00008;
        }
      });

      // Sparkles
      sparkleMeshes.forEach((s, i) => {
        const o = s.userData.offset;
        s.position.y += Math.sin(elapsed * 0.8 + o) * 0.0015;
        s.position.x += Math.sin(elapsed * 0.6 + o + i) * 0.0009;
        s.material.opacity = 0.25 + (Math.sin(elapsed * 2.2 + o) * 0.5 + 0.5) * 0.45;
      });

      // Santa event
      updateSanta(elapsedMs);

      // Keep label attached if showing
      if (currentLabelTarget) {
        const p = new THREE.Vector3();
        currentLabelTarget.getWorldPosition(p);
        p.project(camera);
        const sx = (p.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-p.y * 0.5 + 0.5) * window.innerHeight;
        label.style.left = `${sx}px`;
        label.style.top = `${sy}px`;
      }

      renderer.render(scene, camera);
    }

    animate();

    // ---------------------------
    // RESIZE
    // ---------------------------
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  </script>
</body>
</html>
