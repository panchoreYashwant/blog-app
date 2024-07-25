"use client";
import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Layout,
  Typography,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

interface BlogPost {
  _id: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
}
const { Header, Content } = Layout;
const { Title } = Typography;
const Blog: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/blogs");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/blog",
        formData
      );
      message.success("Blog post created successfully!");
      fetchPosts(); // Refresh posts after creation
    } catch (error) {
      console.error("Error creating blog post:", error);
      message.error("Error creating blog post!");
    }
  };

  const handleImageChange = ({ file }: any) => {
    setImage(file);
  };

  return (
    <Layout>
      <Header className="site-header">
        <Title level={1} className="site-title">
          My Blog 📜
        </Title>
      </Header>
      <Content className="site-content">
        <p>Welcome to my blog. Stay tuned for more updates!</p>
        <div style={{ padding: "30px" }}>
          <Card title="Create Blog Post" style={{ marginBottom: "20px" }}>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Title" required>
                <Input
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Subtitle" required>
                <Input
                  value={subtitle}
                  onChange={(e: any) => setSubtitle(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Content" required>
                <TextArea
                  value={content}
                  onChange={(e: any) => setContent(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Image" required>
                <Upload
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Select Image</Button>
                </Upload>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Create Post
                </Button>
              </Form.Item>
            </Form>
          </Card>
          <Row gutter={[16, 16]}>
            {posts.map((post) => (
              <Col key={post._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  style={{ height: "100%" }}
                  cover={
                    post.imageUrl && (
                      <img
                        src={`http://localhost:5000/${post.imageUrl}`}
                        alt={post.title}
                        layout="responsive"
                        style={{
                          width: "100%",
                          height: "400px",
                          objectFit: "cover",
                        }}
                        objectFit="cover"
                      />
                    )
                  }
                >
                  <Card.Meta
                    title={<strong>{post.title}</strong>}
                    description={
                      <>
                        <p>{post.subtitle}</p>
                        <p>{post.content.slice(0, 100)}...</p>
                        <a href={`/blog/${post._id}`}>Read More</a>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Blog;
