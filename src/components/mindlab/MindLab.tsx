import SectionShell from '../common/SectionShell';
import RubiksCube3D from './RubiksCube3D';
import QuickMathGame from './QuickMathGame';

const MindLab: React.FC = () => {
  return (
    <SectionShell
      id="mind-lab"
      eyebrow="Mind Lab"
      title="Turn abstract concepts into visceral understanding."
      description="Manipulate a 3D Rubik's Cube and race through adaptive micro-challenges designed by cognitive scientists."
    >
      <div className="grid gap-10 md:grid-cols-[3fr,2fr]">
        <RubiksCube3D />
        <QuickMathGame />
      </div>
    </SectionShell>
  );
};

export default MindLab;
