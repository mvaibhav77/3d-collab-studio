export default function SceneEnvironment() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={Math.PI / 2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Ground plane for visual reference */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#f0f0f0" transparent opacity={0.3} />
      </mesh>

      {/* Grid helper for better spatial awareness */}
      <gridHelper args={[100, 100, "#cccccc", "#eeeeee"]} />
    </>
  );
}
