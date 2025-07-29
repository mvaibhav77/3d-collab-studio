export default function ControlsInstructions() {
  return (
    <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg text-sm max-w-xs">
      <h3 className="font-bold mb-2">Camera Controls</h3>
      <div className="space-y-1">
        <div>
          <strong>Drag:</strong> Rotate camera around scene
        </div>
        <div>
          <strong>Mouse wheel:</strong> Zoom in/out toward center
        </div>
        <div>
          <strong>Click objects:</strong> Select and transform
        </div>
      </div>
      <div className="mt-2 text-xs opacity-80">
        Fly around the 3D space with ease!
      </div>
    </div>
  );
}
