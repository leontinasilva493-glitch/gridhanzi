import { learningMetadata, renderLearningPage, type LearningPageProps } from "@/features/worksheets/p1-page-route";

export const generateMetadata = (props: LearningPageProps) => learningMetadata("/chinese-basic-strokes", props);
export default function Page(props: LearningPageProps) { return renderLearningPage("/chinese-basic-strokes", props); }
