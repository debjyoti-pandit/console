import * as React from 'react';
import { shallow } from 'enzyme';
import { ErrorPage404 } from '@console/internal/components/error';
import { DetailsPage } from '@console/internal/components/factory';
import { LoadingBox, StatusBox } from '@console/internal/components/utils';
import { mockHelmReleases } from '../../__tests__/helm-release-mock-data';
import HelmReleaseDetails, { LoadedHelmReleaseDetails } from '../HelmReleaseDetails';

let helmReleaseDetailsProps: React.ComponentProps<typeof HelmReleaseDetails>;
let loadedHelmReleaseDetailsProps: React.ComponentProps<typeof LoadedHelmReleaseDetails>;

describe('HelmReleaseDetails', () => {
  beforeEach(() => {
    helmReleaseDetailsProps = {
      secrets: {
        data: [
          {
            metadata: {
              name: 'secret-name',
              namespace: 'xyz',
              creationTimestamp: '2020-01-13T05:42:19Z',
              labels: {
                name: 'helm-mysql',
                owner: 'helm',
                status: 'deployed',
              },
            },
          },
        ],
        loadError: null,
        loaded: true,
      },
      match: {
        params: {
          ns: 'xyz',
        },
        url: '/helm-releases/ns/xyz/release/helm-mysql',
        isExact: true,
        path: '/helm-releases/ns/xyz/release/:name',
      },
    };

    loadedHelmReleaseDetailsProps = {
      ...helmReleaseDetailsProps,
      helmRelease: {
        loaded: true,
        loadError: null,
        data: mockHelmReleases[0],
      },
    };
  });

  it('should show the loading box if helm release data is not loaded', () => {
    loadedHelmReleaseDetailsProps.helmRelease.loaded = false;
    const helmReleaseDetails = shallow(
      <LoadedHelmReleaseDetails {...loadedHelmReleaseDetailsProps} />,
    );
    expect(helmReleaseDetails.find(LoadingBox).exists()).toBe(true);
  });

  it('should show an error if helm release data could not be loaded', () => {
    loadedHelmReleaseDetailsProps.helmRelease.loadError = new Error('An error!');
    const helmReleaseDetails = shallow(
      <LoadedHelmReleaseDetails {...loadedHelmReleaseDetailsProps} />,
    );
    expect(helmReleaseDetails.find(StatusBox).exists()).toBe(true);
  });

  it('should show the loading box if secret is not loaded', () => {
    loadedHelmReleaseDetailsProps.secrets.loaded = false;
    loadedHelmReleaseDetailsProps.secrets.loadError = undefined;
    const helmReleaseDetails = shallow(
      <LoadedHelmReleaseDetails {...loadedHelmReleaseDetailsProps} />,
    );
    expect(helmReleaseDetails.find(LoadingBox).exists()).toBe(true);
  });

  it('should show the status box if there is an error loading the secret', () => {
    loadedHelmReleaseDetailsProps.secrets.loadError = 'error 404';
    const helmReleaseDetails = shallow(
      <LoadedHelmReleaseDetails {...loadedHelmReleaseDetailsProps} />,
    );
    expect(helmReleaseDetails.find(StatusBox).exists()).toBe(true);
  });

  it('should render the DetailsPage component when secret gets loaded', () => {
    const helmReleaseDetails = shallow(
      <LoadedHelmReleaseDetails {...loadedHelmReleaseDetailsProps} />,
    );
    expect(helmReleaseDetails.find(DetailsPage).exists()).toBe(true);
  });

  it('should show the ErrorPage404 for an incorrect release name in the url', () => {
    loadedHelmReleaseDetailsProps.secrets.data = [];
    const helmReleaseDetails = shallow(
      <LoadedHelmReleaseDetails {...loadedHelmReleaseDetailsProps} />,
    );
    expect(helmReleaseDetails.find(ErrorPage404).exists()).toBe(true);
  });
});
