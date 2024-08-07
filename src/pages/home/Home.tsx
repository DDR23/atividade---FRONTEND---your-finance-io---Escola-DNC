import { Anchor, Button, Group, Image, Modal, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import ModalSignin from "../../components/_ui/modalSignin/ModalSignin";
import ModalSingup from "../../components/_ui/modalSignup/ModalSignup";

export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState<'login' | 'signup' | ''>('');

  const handleOpen = (content: 'login' | 'signup') => {
    setModalContent(content);
    open();
  };

  return (
    <>
      <Stack w='90vw' h='100vh' align="center" justify="center" gap="sm" m='auto'>
        <Image src='coin.png' w={200} />
        <Stack ta='center' align='center' gap={0}>
          <Title order={1}>Manage <Text span c="green" inherit>Your Finance</Text> with Ease</Title>
          <Title fw={500} order={4}>Effortlessly track your bills, income, and expenses. <Text span c="green" inherit fw='500'>Take control of your money</Text> with simplicity and clarity.</Title>
        </Stack>
        <Group className="home__content--btn">
          <Button
            fw={500}
            onClick={() => handleOpen('login')}
          >
            Login
          </Button>
          <Button
            fw={500}
            onClick={() => handleOpen('signup')}
            variant="outline"
          >
            Sign up
          </Button>
        </Group>
        <Modal
          opened={opened}
          onClose={close}
          withCloseButton={false}
          overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3
          }}>
          {modalContent === 'login' && (
            <>
              <ModalSignin />
              <Text c="dimmed" size="sm" ta="center" mt={20}>
                Do not have an account yet?{' '}
                <Anchor size="sm" component="button" onClick={() => handleOpen('signup')}>
                  Create account
                </Anchor>
              </Text>
            </>
          )}
          {modalContent === 'signup' && (
            <>
              <ModalSingup />
              <Text c="dimmed" size="sm" ta="center" mt={20}>
                Already have an account?{' '}
                <Anchor size="sm" component="button" onClick={() => handleOpen('login')}>
                  Login
                </Anchor>
              </Text>
            </>
          )}
        </Modal>
      </Stack>
    </>
  );
}
