import { Result, Row } from "antd";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
      <Result status="404" title={t("title")} subTitle={t("subTitle")} />
    </Row>
  );
}
