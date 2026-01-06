import './Scroll.css';

interface ScrollProps {
  children: React.ReactNode;
}

const Scroll = ({ children }: ScrollProps) => {
  return <div className="scroll">{children}</div>;
};

export default Scroll;
