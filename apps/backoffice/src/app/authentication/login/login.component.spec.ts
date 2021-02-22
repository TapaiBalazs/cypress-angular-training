/* tslint:disable:no-hardcoded-credentials */
import { async } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { LoginComponent } from './login.component';

const mockAuthService = {
  login: jest.fn(),
};

describe('LoginComponent', () => {
  let component: LoginComponent;

  beforeEach(() => {
    jest.mock('@cantina/git-info');
    component = new LoginComponent(new FormBuilder(), mockAuthService as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it(`By default, the form is empty and there is no invalid credentials error and login is prevented`, () => {
    const formdata = component.form.getRawValue();
    expect(formdata.email).toEqual('');
    expect(formdata.password).toEqual('');
    expect(component.isInvalidCredentials).toBe(false);
    component.login();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it(`when user tries to log in with valid credentials, the invalid credentials error is not displayed`, async(() => {
    mockAuthService.login.mockReturnValue(of(true));
    component.form.setValue({
      email: 'test@test.com',
      password: 'thisIs123',
    });
    expect(mockAuthService.login).not.toHaveBeenCalled();
    component.login();
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(component.isInvalidCredentials).toBe(false);
  }));

  it(`when user tries to log in with invalid credentials, the invalid credentials error displayed`, async(() => {
    mockAuthService.login.mockReturnValue(of(false));
    component.form.setValue({
      email: 'test@test.com',
      password: 'thisIs123',
    });
    expect(mockAuthService.login).not.toHaveBeenCalled();
    component.login();
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(component.isInvalidCredentials).toBe(true);
  }));
});
