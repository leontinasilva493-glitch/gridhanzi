import { learningMetadata, renderLearningPage, type LearningPageProps } from "@/features/worksheets/p1-page-route";

export const generateMetadata = (props: LearningPageProps) => learningMetadata("/hsk/3-0-handwriting-requirements", props);
export default function Page(props: LearningPageProps) { return renderLearningPage("/hsk/3-0-handwriting-requirements", props); }
