import AnimatedToastStack from "./AnimatedToastStack";
export default function Toast({ message }: { message: string }) {
  return <AnimatedToastStack toasts={[{ id: message, message, status: "success" }]} />;
}
