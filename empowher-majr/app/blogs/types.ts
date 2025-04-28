import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Blogs: undefined;
  article: { article: Blog };
};
export interface Blog {
  id: string;
  title: string;
  content: string;
}
export type ArticleScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "article"
>;
