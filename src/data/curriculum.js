// src/data/curriculum.js
export const PHASES = [
  {
    id: 0, title: "Planning & Architecture", icon: "📐",
    color: "#a78bfa",
    topics: [
      { s: "Game Design Document", items: ["Write the full GDD (loop, win/lose conditions, abilities, economy)", "Define art direction & style guide", "Define audio palette and music references"] },
      { s: "Systems Architecture", items: ["Map every system and how they communicate", "Define GameManager, EventBus, SceneManager, InputManager", "Define AudioManager, UIManager, SaveSystem, ObjectPooler"] },
      { s: "Scope", items: ["Define MVP — the smallest shippable fun version", "Create a Version 2 list for all out-of-scope features"] }
    ]
  },
  {
    id: 1, title: "C# — The Language", icon: "💻",
    color: "#60a5fa",
    topics: [
      { s: "Memory & Types", items: ["Value vs reference types (stack vs heap)", "All primitive types (int, float, bool, char, string)", "Why GC spikes happen and how to avoid them"] },
      { s: "Control Flow", items: ["if/else, switch/case, all loop types", "Null conditional (?.) and null coalescing (??) operators", "Ternary operator"] },
      { s: "OOP", items: ["Classes, fields, properties, constructors", "Access modifiers (public, private, protected, internal)", "Inheritance, virtual/override, abstract, sealed", "Polymorphism and casting (as, is)", "Interfaces — IDamageable, IInteractable, etc."] },
      { s: "Collections", items: ["Array, List<T>, Dictionary<K,V>", "HashSet<T>, Queue<T>, Stack<T>", "Performance tradeoffs for each"] },
      { s: "Delegates & Events", items: ["Delegates, Action<T>, Func<T>", "event keyword and Observer pattern", "Lambda expressions and multicast delegates"] },
      { s: "Modern C#", items: ["Generic classes and methods with constraints", "async/await for async operations", "LINQ for collection filtering", "Tuples and pattern matching"] }
    ]
  },
  {
    id: 2, title: "Unity Engine Fundamentals", icon: "🎮",
    color: "#34d399",
    topics: [
      { s: "Editor Interface", items: ["Scene, Game, Hierarchy, Inspector, Project, Console windows", "Profiler, Frame Debugger, Memory Profiler", "Animator, Lighting, Package Manager windows"] },
      { s: "MonoBehaviour Lifecycle", items: ["Awake → OnEnable → Start execution order", "FixedUpdate for physics, Update for logic, LateUpdate for camera", "OnTriggerEnter/Stay/Exit, OnCollisionEnter/Stay/Exit", "OnDisable and OnDestroy — unsubscribe events here!", "OnValidate and OnDrawGizmos for editor tools"] },
      { s: "GameObjects & Components", items: ["GetComponent<T>() — cache in Awake, NEVER in Update", "TryGetComponent<T>() zero-allocation version", "SetActive(bool) vs component .enabled", "Instantiate() and Destroy()"] },
      { s: "Transform & Vectors", items: ["position, localPosition, rotation, eulerAngles, localScale", "forward, right, up direction vectors", "Translate(), Rotate(), LookAt()", "Vector3: Distance, Dot, Cross, Lerp, MoveTowards", "Quaternion: LookRotation, Slerp, Euler"] },
      { s: "Scenes", items: ["SceneManager.LoadScene() and LoadSceneAsync()", "Additive scene loading", "DontDestroyOnLoad()"] }
    ]
  },
  {
    id: 3, title: "Physics Systems", icon: "⚙️",
    color: "#f97316",
    topics: [
      { s: "Rigidbody", items: ["mass, drag, angularDrag, useGravity, isKinematic", "AddForce(), AddTorque(), velocity, MovePosition()", "Interpolation and collision detection modes", "Constraints — lock position or rotation axes"] },
      { s: "Colliders", items: ["Box, Sphere, Capsule, Mesh colliders (3D)", "Box2D, Circle2D, Capsule2D, Polygon2D, Edge2D (2D)", "isTrigger, PhysicMaterial, layer collision matrix"] },
      { s: "Physics Queries", items: ["Physics.Raycast() and RaycastAll()", "RaycastNonAlloc() — zero-allocation version", "SphereCast, OverlapSphere, OverlapBox", "LayerMask filtering and RaycastHit data"] },
      { s: "Character Movement", items: ["Rigidbody-based movement", "CharacterController for FPS-style movement", "Kinematic Rigidbody pattern"] }
    ]
  },
  {
    id: 4, title: "Input System", icon: "🕹️",
    color: "#e879f9",
    topics: [
      { s: "Legacy Input", items: ["Input.GetAxis(), GetKey(), GetMouseButton()", "Input.mousePosition in screen coordinates"] },
      { s: "New Input System", items: ["Install via Package Manager", "Input Actions Asset and Action Maps", "Bindings — map actions to physical buttons", "PlayerInput component and callback modes", "ReadValue<T>(), performed/canceled/started events", "Control Schemes (Keyboard+Mouse, Gamepad, Touch)", "Enable/disable action maps per context"] }
    ]
  },
  {
    id: 5, title: "Rendering & Visuals", icon: "✨",
    color: "#fbbf24",
    topics: [
      { s: "Render Pipelines", items: ["Built-in pipeline (legacy)", "URP — recommended for mobile/mid-range", "HDRP — AAA quality for high-end PC/console"] },
      { s: "Shader Graph", items: ["Node-based editor — no HLSL needed", "UV, Time, Fresnel, Sample Texture 2D nodes", "Toon/cell shading, dissolve, outline, hologram effects", "Vertex displacement for animated geometry"] },
      { s: "Lighting", items: ["Directional, Point, Spot, Area light types", "Realtime vs Baked vs Mixed modes", "GI, Light Probes, Reflection Probes", "Cascade shadow maps", "Skybox, ambient light, and fog"] },
      { s: "Post-Processing", items: ["Bloom, Color Grading, Tone Mapping", "Depth of Field, Motion Blur, SSAO", "Vignette, Chromatic Aberration, Film Grain"] },
      { s: "Camera & Cinemachine", items: ["FOV, Clipping Planes, Projection modes", "Multiple cameras for layered rendering", "Cinemachine — Virtual, FreeLook, 2D, Dolly Track cameras"] }
    ]
  },
  {
    id: 6, title: "Animation Systems", icon: "🎬",
    color: "#2dd4bf",
    topics: [
      { s: "Clips & Curves", items: ["Recording mode and keyframe editing", "Curve interpolation (linear, bezier, constant)", "Animation Events — call C# functions from timeline", "Root motion"] },
      { s: "Animator Controller", items: ["States, Transitions, Conditions, Parameters", "Any State and Entry/Exit nodes", "Sub-state machines for organization", "1D and 2D Blend Trees", "Avatar Masking and Animation Layers"] },
      { s: "From Code", items: ["SetFloat/Bool/Integer/SetTrigger()", "CrossFade() for smooth state transitions", "GetCurrentAnimatorStateInfo()"] },
      { s: "IK & 2D", items: ["OnAnimatorIK() callback", "SetIKPosition/Rotation() and blend weights", "Sprite Sheets, Sprite Renderer, Sprite Atlas", "2D Animation package — bone rigs and skinning editor"] },
      { s: "Timeline", items: ["PlayableDirector and track types", "Cinemachine track for cinematic cameras", "Signal emitters at specific moments"] }
    ]
  },
  {
    id: 7, title: "UI Systems", icon: "🖼️",
    color: "#fb7185",
    topics: [
      { s: "Canvas Fundamentals", items: ["Render Modes: Overlay, Camera, World Space", "Canvas Scaler — Scale with Screen Size (always use this)", "Reference Resolution and Match Width/Height"] },
      { s: "Core Components", items: ["RectTransform — anchors, pivot, size delta", "Image types: Simple, Sliced, Tiled, Filled", "TextMeshPro — always use TMP, never legacy Text", "Button, Toggle, Slider, ScrollRect, Dropdown", "LayoutGroup: Horizontal, Vertical, Grid", "ContentSizeFitter and LayoutElement", "Mask for clipping child elements"] },
      { s: "Code & Patterns", items: ["button.onClick.AddListener()", "TMP_Text.text at runtime", "Instantiating UI prefabs (damage numbers, slots)", "Screen stack pattern (push/pop)", "CanvasGroup for alpha/interactability control", "DOTween for fade, slide, scale animations"] }
    ]
  },
  {
    id: 8, title: "Audio Systems", icon: "🔊",
    color: "#818cf8",
    topics: [
      { s: "Core Components", items: ["AudioSource properties — pitch, volume, loop, spatialBlend", "3D audio — rolloffMode, min/max distance", "PlayOneShot() for overlapping sounds without interruption"] },
      { s: "AudioManager", items: ["Singleton pattern with PlaySFX / PlayMusic methods", "Pooled AudioSources for overlapping sounds", "Crossfade between music tracks"] },
      { s: "Audio Mixer", items: ["Mixer Groups: Master, Music, SFX, UI, Ambience", "Snapshots for context transitions (e.g. underwater)", "EQ, Compressor, Reverb effects on groups", "SetFloat() to control mixer parameters from code"] }
    ]
  },
  {
    id: 9, title: "Data & Architecture Patterns", icon: "🏗️",
    color: "#4ade80",
    topics: [
      { s: "ScriptableObjects", items: ["[CreateAssetMenu] attribute", "Store weapon stats, level configs, dialogue data", "SO events as fire-and-forget broadcast channels", "SO variables for shared state without direct references", "SO runtime sets (track all active enemies)"] },
      { s: "Design Patterns", items: ["Singleton (GameManager, AudioManager, UIManager)", "Object Pool — pre-instantiate, recycle objects", "Factory — create objects through a dedicated method", "Observer / Event Bus pattern", "Command pattern for undo systems"] },
      { s: "Save & Prefabs", items: ["PlayerPrefs for small settings (volume, best score)", "JsonUtility or Newtonsoft.Json serialization", "File.WriteAllText to Application.persistentDataPath", "Encryption for anti-cheat save protection", "Prefab Variants and Nested Prefabs"] }
    ]
  },
  {
    id: 10, title: "AI & Game Logic", icon: "🤖",
    color: "#f472b6",
    topics: [
      { s: "Finite State Machines", items: ["States: Idle, Patrol, Chase, Attack, Flee, Dead", "Transitions with conditions", "Implement with enum+switch, abstract State class, or ScriptableObject states"] },
      { s: "NavMesh Navigation", items: ["Bake NavMesh in Window > AI > Navigation", "NavMeshAgent — SetDestination(), remainingDistance", "NavMeshObstacle for dynamic blockers", "OffMeshLinks for jumps and climbs"] },
      { s: "Perception & Pathfinding", items: ["A* algorithm concepts", "Field of View — dot product + distance check", "Raycast line-of-sight verification", "Hearing detection radius events"] },
      { s: "Behavior Trees", items: ["Selector (OR), Sequence (AND), Leaf nodes", "Blackboard shared data store", "Unity BT package or Behavior Designer"] }
    ]
  },
  {
    id: 11, title: "Performance & Optimization", icon: "⚡",
    color: "#facc15",
    topics: [
      { s: "Profiling Tools", items: ["Unity Profiler — CPU, GPU, Memory, Audio", "Frame Debugger — inspect every draw call", "Memory Profiler — find memory leaks", "Stats window — draw calls, batches, verts"] },
      { s: "CPU Optimization", items: ["Cache GetComponent results in Awake()", "Never call Find() or FindObjectOfType() in Update()", "Object Pooling — no runtime Instantiate/Destroy", "Coroutines for spreading work across frames", "Use events not per-frame polling"] },
      { s: "GPU & Memory", items: ["Static Batching, Dynamic Batching, GPU Instancing", "LOD — swap high-poly meshes at distance", "Occlusion Culling — skip geometry hidden behind walls", "Texture atlasing, mipmaps, compression formats", "Addressables for async on-demand asset loading"] }
    ]
  },
  {
    id: 12, title: "Networking & Multiplayer", icon: "🌐",
    color: "#38bdf8",
    topics: [
      { s: "Concepts", items: ["Client-Server vs Peer-to-Peer architecture", "Latency, jitter, packet loss effects on gameplay", "Dead Reckoning and client-side prediction"] },
      { s: "Netcode for GameObjects", items: ["NetworkObject and NetworkBehaviour base class", "NetworkVariable<T> auto-replication to all clients", "ServerRpc and ClientRpc calls", "Unity Relay — route packets without port forwarding", "Unity Lobby for matchmaking"] },
      { s: "Alternatives", items: ["Mirror — open source, widely used", "Photon PUN/Fusion — popular for casual multiplayer"] }
    ]
  },
  {
    id: 13, title: "Editor Tools & Workflow", icon: "🔧",
    color: "#a3e635",
    topics: [
      { s: "Inspector Attributes", items: ["[SerializeField], [Header], [Tooltip], [Range]", "[RequireComponent], [ExecuteAlways]", "[CreateAssetMenu] for ScriptableObjects"] },
      { s: "Custom Editor Tools", items: ["PropertyDrawers — custom Inspector fields for types", "Custom Editors — fully custom Inspector UI", "EditorWindow — floating tool windows", "Gizmos — debug visuals in Scene view"] },
      { s: "Workflow & Packages", items: ["Git + LFS for Unity — always use Git LFS for assets", ".gitignore — exclude Library, Temp, Build folders", "DOTween, Cinemachine, ProBuilder, ProGrids", "Addressables, Shader Graph, VFX Graph, Animation Rigging"] }
    ]
  },
  {
    id: 14, title: "Level Design & World Building", icon: "🗺️",
    color: "#fb923c",
    topics: [
      { s: "Greyboxing", items: ["ProBuilder for raw geometry blockouts", "Lock all metrics before any visual polish", "Playtest for fun before adding any textures", "Iterate layout 3-5 times before art pass"] },
      { s: "Unity Terrain", items: ["Sculpt heightmap with Raise/Lower tools", "Paint Texture, Trees, Details (grass, props)", "Wind Zone for animated vegetation"] },
      { s: "Design Theory", items: ["Nintendo Power Rule — introduce alone, add twist, create challenge", "Signposting with light, color, and geometry shape", "Pacing — deliberately alternate tension and rest zones", "Lock all movement metrics before designing levels"] }
    ]
  },
  {
    id: 15, title: "VFX, Particles & Game Feel", icon: "🎆",
    color: "#c084fc",
    topics: [
      { s: "Particle System", items: ["Main module: Duration, Lifetime, Speed, Size, Color", "Emission — rate over time and bursts", "Shape — cone, sphere, box, mesh spawn areas", "Color/Size/Rotation over Lifetime curves", "Noise module for turbulence", "Texture Sheet Animation (flipbook sprites)", "Sub Emitters — particles spawning particles", "Trails, Collision module, Renderer module"] },
      { s: "VFX Graph", items: ["GPU-driven — handles millions of particles", "Spawn, Initialize, Update, Output contexts", "Requires URP or HDRP"] },
      { s: "Game Feel / Juice", items: ["Screen shake — trauma system with random camera offset", "Hit stop / Hitstun — freeze frames on impact (2-6 frames)", "Squash and stretch on landing/jumping", "Time.timeScale for slow motion moments", "DOTween punch scale on UI buttons", "Vignette pulse on low health"] }
    ]
  },
  {
    id: 16, title: "Publishing & Monetization", icon: "🚀",
    color: "#f43f5e",
    topics: [
      { s: "Build & Ship", items: ["Player Settings — bundle ID, version, icons, splash screen", "Android — Keystore signing, AAB required for Play Store", "iOS — Xcode, Apple Developer account, Provisioning Profile", "IL2CPP backend for all release builds", "Google Play Console tracks (internal → alpha → beta → production)", "App Store Connect and TestFlight for iOS betas"] },
      { s: "Analytics", items: ["Firebase Analytics — free, custom event schemas", "GameAnalytics — game-specific metrics and economy tracking", "Funnel analysis — pinpoint tutorial drop-off points", "Heatmaps for player deaths and navigation patterns"] },
      { s: "Monetization", items: ["Unity IAP — consumable, non-consumable, subscription types", "Unity LevelPlay / AdMob mediation platform", "Rewarded Video ads — highest ARPU, player opts in willingly", "App Store Optimization (ASO) — icon, screenshots, keywords"] }
    ]
  }
];

export const totalItems = () =>
  PHASES.reduce((a, p) => a + p.topics.reduce((b, s) => b + s.items.length, 0), 0);

export const phaseItemCount = (phase) =>
  phase.topics.reduce((a, s) => a + s.items.length, 0);
